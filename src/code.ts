/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  const { type, data } = msg;
  if (type === 'find-all-nodes') {
    const nodes = findAllNodes();
    sendToUI('found-nodes', { nodes });
  } else if (type === 'zoom-into-node') {
    const node = findNodeById(data.nodeId);
    figma.currentPage.selection = [node];
    figma.viewport.scrollAndZoomIntoView([node]);
  } else if (type === 'rename-node') {
    const node = findNodeById(data.nodeId);
    node.name = data.newName;
    sendToUI('node-renamed', { nodeId: data.nodeId });
  } else if (type === 'close-plugin') {
    figma.closePlugin();
  }
};

function sendToUI<T>(type: string, data: T) {
  figma.ui.postMessage({ type, data }); // onmessage = e => const {type, data} = e.data.pluginMessage;
}

type NameNode = {
  id: string;
  name: string;
};

function findAllNodes(): NameNode[] {
  const regex = RegExp(
    /(Union|Substract|Intersect|Exclude|(Page|Frame|Group|Slice|Rectangle|Line|Ellipse|Polygon|Star|Vector|Text|Component) (\d+))/
  );
  if (figma.currentPage.selection.length > 0) {
    return figma.currentPage.selection.reduce<NameNode[]>((a, c) => {
      if (c.type === 'GROUP' || c.type === 'FRAME') {
        return [
          ...a,
          ...mapToNameNode(c.findAll(node => regex.test(node.name))),
        ];
      } else if (regex.test(c.name)) {
        return [...a, { id: c.id, name: c.name }];
      } else {
        return a;
      }
    }, []);
  } else {
    return mapToNameNode(
      figma.currentPage.findAll(node => regex.test(node.name))
    );
  }
}

function mapToNameNode(nodes: SceneNode[]): NameNode[] {
  return nodes.map(({ id, name }) => ({ id, name }));
}

function findNodeById(nodeId: string): SceneNode {
  return figma.currentPage.findOne(node => node.id === nodeId);
}
