export function edgeArrowId(source, target) {
    return `${source}>${target}`;
}
export function saveFlow(elements, nanoid, setOpenMenuClick) {
    const downloadLink = document.createElement("a");
    const fileBlob = new Blob([JSON.stringify(elements, null, 2)], {
        type: "application/json",
    });
    downloadLink.href = URL.createObjectURL(fileBlob);
    downloadLink.download = "square-bear-flow" + nanoid(3) + ".json";
    downloadLink.click();
    setOpenMenuClick(false);
}
export function WordCount(str) {
    return str.split(" ");
}

export function WordCountLength(str) {
    return str.split(" ").length;
}