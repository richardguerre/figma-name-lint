/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'find-all-nodes') {
    const nodes = findAllNodes();
    sendToUI('found-nodes', { nodes });
  } else if (msg.type === 'zoom-into-node') {
    const node = findNodeById(msg.data.nodeId);
    figma.viewport.scrollAndZoomIntoView([node]);
  } else if (msg.type === 'rename-node') {
    const node = findNodeById(msg.data.nodeId);
    node.name = msg.data.newName;
  } else if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};

function sendToUI<T>(type: string, data: T) {
  figma.ui.postMessage({ type, data }); // onmessage = e => const {type, data} = e.data.pluginMessage;
}

function findAllNodes(): SceneNode[] {
  const regex = RegExp(
    /(Union|Substract|Intersect|Exclude|(Page|Frame|Group|Slice|Rectangle|Line|Ellipse|Polygon|Star|Vector|Text|Component) (\d+))/
  );
  if (figma.currentPage.selection.length > 0) {
    return figma.currentPage.selection.reduce<SceneNode[]>((a, c) => {
      if (c.type === 'GROUP' || c.type === 'FRAME') {
        return [...a, ...c.findAll(node => regex.test(node.name))];
      } else if (regex.test(c.name)) {
        return [...a, c];
      } else {
        return a;
      }
    }, []);
  } else {
    return figma.currentPage.findAll(node => regex.test(node.name));
  }
}

function findNodeById(nodeId: string): SceneNode {
  return figma.currentPage.findOne(node => node.id === nodeId);
}
