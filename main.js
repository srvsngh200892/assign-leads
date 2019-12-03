const { assignLeadsToAgents } = require("./src/assignLeads");


/**
 * Function to validate command line arguments and return error if any
 * @param {string} agentCsv file name.
 * @param {string} leadCsv file name.
 */
function validateInput(agentCsv, leadCsv) {
    if(!agentCsv || !leadCsv) {
        throw ("Please pass valid agruments")
    }

    if (!isValidFileExtention(agentCsv, leadCsv)) {
        throw ("invalid file extension")
    }
}

function isValidFileExtention(agentCsv, leadCsv) {
    if((agentCsv.split('.').length>1 && agentCsv.split('.')[1].toLowerCase() =='csv') && (leadCsv.split('.').length>1 && leadCsv.split('.')[1].toLowerCase() =='csv')) {
        return true
    }
    return false
}


/**
 * Function to print output
 * @param {object} data.
 */
function printData(data) {
    console.log("Leads            Agents ID & Name ")
    Object.keys(data).forEach(key=>{
        data[key].forEach(value=>{
            console.log(`${value}       ${key}`)
        })
    })
}

(async () => { 
    try {
        const agentCsv = process.argv[3]
        const leadCsv = process.argv[2]
        validateInput(agentCsv, leadCsv)
        printData(await assignLeadsToAgents(agentCsv, leadCsv))
        process.exit(0)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
})();
