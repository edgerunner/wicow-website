import agents from "./agents.yaml";

console.table(agents);

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

export default (req, res) => {
    const agent = agents
        .filter(agent => agent.languages.includes(req.query.language))
        .random()

    agent 
    ? res.status(200).json(agent)
    : res.status(404).json({ error: "Agent not found" });
}