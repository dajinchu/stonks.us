const fetch = require('node-fetch');

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const apiToNode = async () => {
    const dayJson = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo').then(a => a.json())
    const date = dayJson['Meta Data']['3. Last Refreshed'].substring(0, 10);
    const todayOpen = dayJson['Time Series (Daily)'][date]['1. open']

    const recentJson = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo').then(a => a.json())
    const time = recentJson['Meta Data']['3. Last Refreshed'];
    const recent = recentJson['Time Series (1min)'][time]['1. open']

    const isGoingUp = parseFloat(todayOpen) < parseFloat(recent);
    const data = {isGoingUp: isGoingUp};

    const nodeId = createNodeId(`alpha-vantage-stonks`)
    const nodeContent = JSON.stringify(data)
    const nodeData = Object.assign({}, data, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `Stonk`,
        content: nodeContent,
        contentDigest: createContentDigest(data),
      },
    })
    return nodeData
  }

  const { createNode } = actions
  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  // plugin code goes here...
  const nodeData = await apiToNode();
  createNode(nodeData);
}