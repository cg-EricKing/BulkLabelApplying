// Bulk Label Applying Script
// This script will apply filtering labels to a large account-level-label

// Script must run on the entire label set even over 50 accounts.
// Create labels to break accounts in label set into monthly label subsets (CMS-IYP-FEB2018)


// Select the account
// Select the campaign
// Conditional check to see the end date (Month, Year)
// If End date matches to the label you wish to apply (Ex. FEB2018) apply it to the ACCOUNT LEVEL

 // ***************Only working on first 50 =(
var SCRIPT_LABEL = 'iHeart';

function run() {
        var mccAccount = AdWordsApp.currentAccount();
        var accountsToChange = MccApp.accounts().get();
        var accountToBeChanged = accountsToChange.next();
        var accountName = AdWordsApp.currentAccount().getName();
        Logger.log("Account: " + accountName);
        
        var labelName = "iHeart-FEB18";
        //account.applyLabel(labelName);
        MccApp.select(accountToBeChanged);
        
        var campaignIterator = AdWordsApp.campaigns().get();
        while (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        var campaignName = campaign.getName();
        Logger.log("Campaign Name: " + campaignName);
        var endMonth = campaign.getEndDate().month;
        var endYear = campaign.getEndDate().year;
        Logger.log("End Date: " + endMonth + " " + endYear);
          
          if(endMonth === 2 && endYear === 2018) {
            accountToBeChanged.applyLabel(labelName);
            Logger.log("Label Applied!");
        }
        MccApp.select(mccAccount);
    }
}

// this will execute your script sequentially accounts and is only used for accounts in excess of 50
function executeInSequence(sequentialIds, executeSequentiallyFunc) {
    sequentialIds.forEach(function (accountId) {
        var account = MccApp.accounts().withIds([accountId]).get().next();
        MccApp.select(account);
        executeSequentiallyFunc();
    });
}

// our custom main function responsible for executing the run function
function main() {
    try {
        var accountSelector = MccApp.accounts().orderBy('Name');
        if (SCRIPT_LABEL) {
            accountSelector = accountSelector.withCondition("LabelNames CONTAINS '" + SCRIPT_LABEL + "'");
        }
        var accountIterator = accountSelector.get();
        var accountIds = [];
        while (accountIterator.hasNext()) {
            var account = accountIterator.next();
            accountIds.push(account.getCustomerId());
        }
        var parallelIds = accountIds.slice(0, 50);
        var sequentialIds = accountIds.slice(50);
        MccApp.accounts()
            .withIds(parallelIds)
            .executeInParallel('run');
        if (sequentialIds.length > 0) {
            executeInSequence(sequentialIds, run);
        }
    }
    catch (exception) {
        Logger.log('Running on non-MCC account.');
        run();
    }
}


function main() {
    var accountSelector = MccApp.accounts()
    .withLimit(50)
    .withCondition("Impressions > 100")
    .forDateRange("THIS_MONTH")
    .orderBy("Impressions ASC");

    accountSelector.executeInParallel("processAccount", "afterProcess");
}

function processAccount() {
    var mccAccount = AdWordsApp.currentAccount();
    var accountsToChange = MccApp.accounts().get();
    var accountToBeChanged = accountsToChange.next();
    var accountName = AdWordsApp.currentAccount().getName();
    Logger.log("Account: " + accountName);
    
    var labelName = "iHeart-FEB18";
    //account.applyLabel(labelName);
    MccApp.select(accountToBeChanged);
    
    var campaignIterator = AdWordsApp.campaigns().get();
    while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var campaignName = campaign.getName();
    Logger.log("Campaign Name: " + campaignName);
    var endMonth = campaign.getEndDate().month;
    var endYear = campaign.getEndDate().year;
    Logger.log("End Date: " + endMonth + " " + endYear);
      
      if(endMonth === 2 && endYear === 2018) {
        accountToBeChanged.applyLabel(labelName);
        Logger.log("Label Applied!");
    }
    MccApp.select(mccAccount);
}
}

function afterProcess() {
    Logger.log("Process completed!");
}