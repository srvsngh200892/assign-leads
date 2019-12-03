const assert = require("assert");
const fs = require("fs");
const assignLeads = require("../src/assignLeads.js");

describe("#assignLeadsToAgents", () => {
  context("when wrong csv data provided", () => {
    it("should return valid error", async () => {
      try {
        const output = await assignLeads.assignLeadsToAgents("test/fixture/agents.csv", "test/fixture/wrong_headers_leads.csv")
      } catch(error) {
        assert.equal('CSV contains Wrong Data', error);
      }
    });
  });
  context("when all agents are busy", () => {
    it("should return valid error", async () => {
      try {
        const output = await assignLeads.assignLeadsToAgents("test/fixture/all_agents_busy.csv", "test/fixture/leads.csv")
      } catch(error) {
        assert.equal('All agents are busy', error);
      }
    });
  });
  context("when valid csv provided", () => {
    it("should hash of agents and assigned leads to them", async () => {
      const expectedOutput = { '45 dimitry@gmail.ru': '1 John',
                                '46 ahmed@yahoo.ae': '3 Marie',
                                '47 leila@gmail.com': '3 Marie',
                                '48 henry@gmail.com': '4 Ted',
                                '49 mahmoud@yahoo.com': '1 John',
                                '50 juan@aol.com': '3 Marie',
                                '51 test@yahoo.com': '3 Marie' 
                              }
      const output = await assignLeads.assignLeadsToAgents("test/fixture/agents.csv", "test/fixture/leads.csv")
      assert.deepEqual(expectedOutput, output);
    });
  });
});
