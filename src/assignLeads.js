const csv = require('csvtojson')

const AGENT_HEADERS = Object.freeze(['ID','Name','Status','Weight'])
const LEAD_HEADERS = Object.freeze(['ID','Email','Name'])

/**
 * Function to  read and validate csv and assign leads to agent and return hashmap of agent as key and array of leads
 * @param {file, object} agentFile.
 * @param {file object} leadsData.
 */
async function assignLeadsToAgents(agentFile, leadsFile) {
  try {
    let agentDataPromise = csv().fromFile(agentFile)
    let leadsDataPromise = csv().fromFile(leadsFile)
    let [agentData, leadsData] = await Promise.all([agentDataPromise, leadsDataPromise]);
    agentData = sortById(agentData)
    leadsData = sortById(leadsData)
    checkCsvHeaders(agentData, leadsData)
    checkAllAgentBusy(agentData)
    
    return doAssignment(agentData, leadsData)
  } catch(error) {
    throw error;
  }
}

/**
 * Function to  assign leads to agent in round robin fashion and return hashmap of agent as key and array of leads
 * @param {array object} agentData.
 * @param {array object} leadsData.
 */
function doAssignment(agentData, leadsData) {
 let numberOfAgent = agentData.length;
 let index = 0;
 let agentLeadsHash = {};
 while(leadsData.length > 0) {
  // get the agent
  const agent = agentData[index]
  // check agent status
  if(agent.Status.toLowerCase() == 'available'){
    // get the weight of agent
    let weight = agent.Weight
    while(weight>0) {
      //pop leads from leads queue (First in First out)
      const lead = leadsData.shift();
      if(!lead) {
        return agentLeadsHash
      }
      // build agent and lead hasmap
      agentLeadsHash[`${agent.ID} ${agent.Name}`] = agentLeadsHash[`${agent.ID} ${agent.Name}`] ? agentLeadsHash[`${agent.ID} ${agent.Name}`].concat([lead.Email]) : [lead.Email]
      weight--;
    }
  }
  if (!leadsData.length) {
    return agentLeadsHash;
  }
  index++;
  // if indx and number of agent are equal reset the index to zero to continue round robin
  if (index == numberOfAgent) {
     index = 0;
  }
 }
 return agentLeadsHash
}

/**
 * Function to check all agents are busy and return error
 * @param {array object} agents.
 */
function checkAllAgentBusy(agents){
  if (!agents.filter(data=> data.Status.toLowerCase() === 'available').length) {
    throw 'All agents are busy'
  }
}

/**
 * Function to check all csv header are vaild and file is not empty and return error
 * @param {array object} agentData.
 * @param {array object} agentData.
 */

function checkCsvHeaders(agentData, leadsData) {
  if ((!agentData.length || Object.keys(agentData[0]).filter(value => AGENT_HEADERS.includes(value)).length != AGENT_HEADERS.length) ||
  (!leadsData.length || Object.keys(leadsData[0]).filter(value => LEAD_HEADERS.includes(value)).length != LEAD_HEADERS.length)) {
    throw 'CSV contains Wrong Data'
  }

}

/**
 * Function to check all csv header are vaild and file is not empty and return error
 * @param {array object} agentData.
 * @param {array object} agentData.
 */
function removeBusyAgents(agentData) {
  return agentData.filter(data=> data.Status.toLowerCase() != 'busy')
}

/**
 * Function to sort array of object based on ID and return sorted array of object
 * @param {array object} record.
 */
function sortById(record) {
  return record.sort((a,b) => (a.ID > b.ID) ? 1 : ((b.ID > a.ID) ? -1 : 0));
}

module.exports = {
  assignLeadsToAgents
};
