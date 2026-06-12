// ===== NETWORK GRAPH (D3.js) =====
const networkData = {
    "RELIANCE": {
        nodes: [
            { id: "RELIANCE", type: "stock", risk: 87 },
            { id: "CEO", type: "insider", risk: 90 },
            { id: "Board Member A", type: "insider", risk: 75 },
            { id: "Broker X", type: "broker", risk: 60 },
            { id: "Associate 1", type: "associate", risk: 55 },
        ],
        links: [
            { source: "CEO", target: "RELIANCE", label: "14 days before" },
            { source: "Board Member A", target: "RELIANCE", label: "11 days before" },
            { source: "CEO", target: "Broker X", label: "known associate" },
            { source: "Broker X", target: "Associate 1", label: "trade routed" },
            { source: "Associate 1", target: "RELIANCE", label: "9 days before" },
        ]
    },
    "TCS": {
        nodes: [
            { id: "TCS", type: "stock", risk: 72 },
            { id: "CFO", type: "insider", risk: 70 },
            { id: "Director B", type: "insider", risk: 65 },
            { id: "Broker Y", type: "broker", risk: 50 },
        ],
        links: [
            { source: "CFO", target: "TCS", label: "15 days before" },
            { source: "Director B", target: "TCS", label: "12 days before" },
            { source: "CFO", target: "Broker Y", label: "known associate" },
        ]
    },
    "ADANIENT": {
        nodes: [
            { id: "ADANIENT", type: "stock", risk: 91 },
            { id: "Chairman", type: "insider", risk: 95 },
            { id: "MD", type: "insider", risk: 88 },
            { id: "Broker Z", type: "broker", risk: 75 },
            { id: "Associate 2", type: "associate", risk: 70 },
            { id: "Associate 3", type: "associate", risk: 65 },
        ],
        links: [
            { source: "Chairman", target: "ADANIENT", label: "18 days before" },
            { source: "MD", target: "ADANIENT", label: "14 days before" },
            { source: "Chairman", target: "Broker Z", label: "known associate" },
            { source: "Broker Z", target: "Associate 2", label: "trade routed" },
            { source: "Broker Z", target: "Associate 3", label: "trade routed" },
            { source: "Associate 2", target: "ADANIENT", label: "10 days before" },
            { source: "Associate 3", target: "ADANIENT", label: "8 days before" },
        ]
    },
    "WIPRO": {
        nodes: [
            { id: "WIPRO", type: "stock", risk: 85 },
            { id: "CTO", type: "insider", risk: 82 },
            { id: "Board Member C", type: "insider", risk: 70 },
            { id: "Broker W", type: "broker", risk: 60 },
        ],
        links: [
            { source: "CTO", target: "WIPRO", label: "9 days before" },
            { source: "Board Member C", target: "WIPRO", label: "7 days before" },
            { source: "CTO", target: "Broker W", label: "known associate" },
        ]
    },
    "INFY": {
        nodes: [
            { id: "INFY", type: "stock", risk: 65 },
            { id: "VP Finance", type: "insider", risk: 62 },
            { id: "Broker V", type: "broker", risk: 45 },
        ],
        links: [
            { source: "VP Finance", target: "INFY", label: "17 days before" },
            { source: "VP Finance", target: "Broker V", label: "known associate" },
        ]
    }
};

function getNodeColor(node) {
    if (node.type === "stock") return "#3b82f6";
    if (node.risk >= 80) return "#ef4444";
    if (node.risk >= 60) return "#f59e0b";
    return "#10b981";
}

function getNodeSize(node) {
    if (node.type === "stock") return 22;
    if (node.type === "insider") return 18;
    if (node.type === "broker") return 14;
    return 12;
}

let simulation = null;

function updateNetworkGraph(ticker) {
    const container = document.getElementById('networkGraph');
    container.innerHTML = '';

    const data = networkData[ticker] || networkData["RELIANCE"];
    const width = container.clientWidth || 600;
    const height = 280;

    const svg = d3.select('#networkGraph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 28)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#4b5563');

    if (simulation) simulation.stop();

    simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links)
            .id(d => d.id)
            .distance(90))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide(30));

    // Links
    const link = svg.append('g')
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
        .attr('stroke', '#1f2d45')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)');

    // Link labels
    const linkLabel = svg.append('g')
        .selectAll('text')
        .data(data.links)
        .enter().append('text')
        .attr('font-size', '9px')
        .attr('fill', '#4b5563')
        .attr('text-anchor', 'middle')
        .text(d => d.label);

    // Node groups
    const node = svg.append('g')
        .selectAll('g')
        .data(data.nodes)
        .enter().append('g')
        .call(d3.drag()
            .on('start', dragStart)
            .on('drag', dragging)
            .on('end', dragEnd));

    // Node circles
    node.append('circle')
        .attr('r', d => getNodeSize(d))
        .attr('fill', d => getNodeColor(d) + '22')
        .attr('stroke', d => getNodeColor(d))
        .attr('stroke-width', 2);

    // Node labels
    node.append('text')
        .attr('dy', d => getNodeSize(d) + 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#9ca3af')
        .text(d => d.id);

    // Risk score on node
    node.append('text')
        .attr('dy', '4px')
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('fill', d => getNodeColor(d))
        .text(d => d.type !== 'stock' ? d.risk : '');

    // Tooltip
    node.append('title')
        .text(d => `${d.id}\nType: ${d.type}\nRisk: ${d.risk}/100`);

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        linkLabel
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2);

        node.attr('transform', d =>
            `translate(${Math.max(25, Math.min(width - 25, d.x))},
             ${Math.max(25, Math.min(height - 25, d.y))})`
        );
    });
}

function dragStart(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragging(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnd(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}