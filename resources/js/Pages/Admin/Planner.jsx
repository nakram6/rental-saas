import React, { useEffect, useState, useRef, useCallback } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTheme } from "@/Context/ThemeContext";

const STORAGE_KEY = "decorLibrary_v1";

const DEFAULT_LIBRARY = [
    {
        id: "sofa-1",
        name: "White Sofa 3-seater",
        type: "sofa",
        tag: "Stage",
        image: "/images/planner/sofa-white.png", // put file in public/images/planner
    },
    {
        id: "table-1",
        name: "Round Table (8 chairs)",
        type: "table",
        tag: "Guests",
        image: "/images/planner/table-round.png",
    },
    {
        id: "chair-1",
        name: "White Chair",
        type: "chair",
        tag: "Guests",
        image: "/images/planner/chair-white.png",
    },
    {
        id: "flower-1",
        name: "Flower Stand",
        type: "flower",
        tag: "Aisle",
        image: "/images/planner/flower-stand.png",
    },
    { id: "candles-1", name: "Candle Cluster", type: "other", tag: "Floor decor" },
];

const COLOR_CHOICES = [
    "#dbeafe",
    "#ede9fe",
    "#fee2e2",
    "#fef3c7",
    "#e5e7eb",
    "#bbf7d0",
];

function defaultItemColor(type) {
    if (type === "chair") return "#dbeafe";
    if (type === "table") return "#ede9fe";
    if (type === "sofa") return "#fee2e2";
    if (type === "flower") return "#fef3c7";
    return "#e5e7eb";
}

function typeBadgeColor(type) {
    if (type === "chair") return "bg-sky-500/10 text-sky-300 border-sky-500/60";
    if (type === "table") return "bg-purple-500/10 text-purple-300 border-purple-500/60";
    if (type === "sofa") return "bg-rose-500/10 text-rose-300 border-rose-500/60";
    if (type === "flower") return "bg-amber-500/10 text-amber-300 border-amber-500/60";
    return "bg-slate-700/40 text-slate-200 border-slate-500/60";
}

/**
 * Single item on canvas (can be pill OR image)
 */
function DecorItem({
    item,
    onMove,
    onResize,
    onRotate,
    onSelect,
    isSelected,
    onContextMenu,
    canvasRectGetter,
}) {
    // drag
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = item.left;
        const startTop = item.top;

        const move = (ev) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            onMove(item.id, { left: startLeft + dx, top: startTop + dy });
        };

        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    // resize
    const handleResizeMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = item.width;
        const startHeight = item.height;

        const move = (ev) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            const newWidth = Math.max(40, startWidth + dx);
            const newHeight = Math.max(30, startHeight + dy);
            onResize(item.id, { width: newWidth, height: newHeight });
        };

        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    // rotate
    const handleRotateMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const canvasRect = canvasRectGetter();
        const centerX = canvasRect.left + item.left + item.width / 2;
        const centerY = canvasRect.top + item.top + item.height / 2;

        const startAngle = item.rotation;
        const startPointerAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

        const move = (ev) => {
            const pointerAngle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
            const delta = (pointerAngle - startPointerAngle) * (180 / Math.PI);
            onRotate(item.id, startAngle + delta);
        };

        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const canvasRect = canvasRectGetter();
        onContextMenu(item.id, {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top,
        });
    };

    const hasImage = !!item.image;

    return (
        <div
            onMouseDown={handleMouseDown}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
            }}
            onContextMenu={handleContextMenu}
            className={[
                "absolute border shadow-md cursor-move select-none transition-shadow rounded-xl",
                isSelected ? "ring-2 ring-orange-500 shadow-orange-500/40" : "",
            ].join(" ")}
            style={{
                left: item.left,
                top: item.top,
                width: item.width,
                height: item.height,
                backgroundColor: hasImage ? "transparent" : item.color,
                borderColor: "#4b5563",
                transform: `rotate(${item.rotation}deg)`,
                transformOrigin: "center center",
            }}
        >
            {/* IMAGE MODE */}
            {hasImage && (
                <>
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="absolute left-1 bottom-1 right-1 flex justify-center pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white backdrop-blur-sm truncate">
                            {item.name}
                        </span>
                    </div>
                </>
            )}

            {/* TEXT MODE */}
            {!hasImage && (
                <div className="w-full h-full flex items-center justify-center text-[11px] font-medium text-slate-900 px-1">
                    <span className="truncate">{item.name}</span>
                </div>
            )}

            {/* rotate handle */}
            {isSelected && (
                <div
                    onMouseDown={handleRotateMouseDown}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border border-white shadow cursor-crosshair"
                    data-handle="rotate"
                />
            )}

            {/* resize handle */}
            {isSelected && (
                <div
                    onMouseDown={handleResizeMouseDown}
                    className="absolute w-4 h-4 rounded-full bg-orange-400 border border-white shadow -right-1.5 -bottom-1.5 cursor-se-resize"
                    data-handle="resize"
                />
            )}
        </div>
    );
}

export default function Planner({ auth }) {

const { theme } = useTheme();

    const pageBg =
        theme === "light"
            ? "bg-gray-100"
            : theme === "gold"
            ? "bg-[#020617]"
            : "bg-slate-900"; // default dark



    // library
    const [library, setLibrary] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [itemName, setItemName] = useState("");
    const [itemType, setItemType] = useState("chair");
    const [itemTag, setItemTag] = useState("");
    const [itemImageUrl, setItemImageUrl] = useState("");

    // canvas items
    const [items, setItems] = useState([]);
    const [counter, setCounter] = useState(0);

    // stage
    const [stage, setStage] = useState(null); // {x,y,width,height,color,rotation}
    const [drawStageMode, setDrawStageMode] = useState(false);

    // selection
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedType, setSelectedType] = useState(null); // 'stage' | 'item' | null

    // context menu
    const [menu, setMenu] = useState({
        visible: false,
        target: null, // 'item' | 'stage'
        itemId: null,
        x: 0,
        y: 0,
    });

    const canvasRef = useRef(null);

    const getCanvasRect = () =>
        canvasRef.current ? canvasRef.current.getBoundingClientRect() : { left: 0, top: 0 };

    // load / save library
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) {
                setLibrary(JSON.parse(raw));
            } else {
                setLibrary(DEFAULT_LIBRARY);
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LIBRARY));
            }
        } catch {
            setLibrary(DEFAULT_LIBRARY);
        }
    }, []);

    useEffect(() => {
        if (!library.length) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
        } catch {
            // ignore
        }
    }, [library]);

    // add items to canvas
    const addToCanvas = useCallback(
        (libItem, qty) => {
            const baseX = 60;
            const baseY = 80;
            const spacingX = 80;
            const spacingY = 70;
            const cols = libItem.type === "chair" ? 10 : 6;

            setItems((prev) => {
                const next = [...prev];
                for (let i = 0; i < qty; i++) {
                    const row = Math.floor(i / cols);
                    const col = i % cols;
                    next.push({
                        id: `item-${counter + i}`,
                        name: libItem.name,
                        type: libItem.type,
                        tag: libItem.tag,
                        image: libItem.image || null,
                        left: baseX + col * spacingX,
                        top: baseY + row * spacingY,
                        width: libItem.image ? 90 : 90,
                        height: libItem.image ? 80 : 28,
                        color: defaultItemColor(libItem.type),
                        rotation: 0,
                    });
                }
                return next;
            });
            setCounter((c) => c + qty);
        },
        [counter]
    );

    const handleAddOne = (li) => addToCanvas(li, 1);
    const handleAddMany = (li) => {
        const raw = quantities[li.id] || "1";
        const n = parseInt(raw, 10);
        addToCanvas(li, !isNaN(n) && n > 0 ? n : 1);
    };

    const handleQtyChange = (id, value) =>
        setQuantities((prev) => ({ ...prev, [id]: value }));

    const handleAddLibraryItem = (e) => {
        e.preventDefault();
        if (!itemName.trim()) return;

        const id = `${itemType}-${Date.now()}`;
        setLibrary((prev) => [
            ...prev,
            {
                id,
                name: itemName.trim(),
                type: itemType,
                tag: itemTag.trim(),
                image: itemImageUrl.trim() || null, // if empty → coloured rectangle
            },
        ]);
        setItemName("");
        setItemTag("");
        setItemImageUrl("");
    };

    const handleResetLibrary = () => {
        if (!window.confirm("Reset library to default items?")) return;
        setLibrary(DEFAULT_LIBRARY);
        setQuantities({});
    };

    // selection
    const clearSelection = () => {
        setSelectedItemId(null);
        setSelectedType(null);
        setMenu({ visible: false, target: null, itemId: null, x: 0, y: 0 });
    };

    const handleCanvasClick = () => {
        if (drawStageMode) return;
        clearSelection();
    };

    const canvasPosFromEvent = (ev) => {
        const rect = getCanvasRect();
        return {
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top,
        };
    };

    // draw stage
    const handleCanvasMouseDown = (ev) => {
        if (!drawStageMode) return;

        ev.preventDefault();
        ev.stopPropagation();

        const start = canvasPosFromEvent(ev);
        setStage({
            x: start.x,
            y: start.y,
            width: 0,
            height: 0,
            color: "#020617",
            rotation: 0,
        });

        const move = (e) => {
            const pos = canvasPosFromEvent(e);
            const x = Math.min(start.x, pos.x);
            const y = Math.min(start.y, pos.y);
            const w = Math.abs(pos.x - start.x);
            const h = Math.abs(pos.y - start.y);
            setStage((prev) => ({ ...prev, x, y, width: w, height: h }));
        };

        const up = () => {
            setDrawStageMode(false);
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    const handleSelectStage = (e) => {
        e.stopPropagation();
        if (!stage) return;
        setSelectedType("stage");
        setSelectedItemId(null);
        setMenu({ visible: false, target: null, itemId: null, x: 0, y: 0 });
    };

    // drag stage (click anywhere on stage, NOT handles)
    const handleStageDragMouseDown = (e) => {
        if (!stage) return;

        const handleType = e.target?.dataset?.handle;
        if (handleType === "stage-rotate" || handleType === "stage-resize") return;

        e.preventDefault();
        e.stopPropagation();
        handleSelectStage(e);

        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = stage.x;
        const startTop = stage.y;

        const move = (ev) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            setStage((prev) => ({
                ...prev,
                x: startLeft + dx,
                y: startTop + dy,
            }));
        };

        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    // resize stage
    const handleStageResizeMouseDown = (e) => {
        if (!stage) return;
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = stage.width;
        const startHeight = stage.height;

        const move = (ev) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            const w = Math.max(80, startWidth + dx);
            const h = Math.max(80, startHeight + dy);
            setStage((prev) => ({ ...prev, width: w, height: h }));
        };

        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    // rotate stage
    const handleStageRotateMouseDown = (e) => {
        if (!stage) return;
        e.preventDefault();
        e.stopPropagation();

        const rect = getCanvasRect();
        const centerX = rect.left + stage.x + stage.width / 2;
        const centerY = rect.top + stage.y + stage.height / 2;
        const startAngle = stage.rotation || 0;
        const startPointerAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

        const move = (ev) => {
            const pointerAngle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
            const delta = (pointerAngle - startPointerAngle) * (180 / Math.PI);
            setStage((prev) => ({ ...prev, rotation: startAngle + delta }));
        };

        const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    const updateStageColor = (color) => {
        if (!stage) return;
        setStage((prev) => ({ ...prev, color }));
    };

    // items transforms
    const handleItemMove = (id, pos) => {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...pos } : i)));
    };

    const handleItemResize = (id, size) => {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...size } : i)));
    };

    const handleItemRotate = (id, rotation) => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, rotation } : i))
        );
    };

    const handleSelectItem = (id) => {
        setSelectedItemId(id);
        setSelectedType("item");
        setMenu({ visible: false, target: null, itemId: null, x: 0, y: 0 });
    };

    // context menu
    const openItemMenu = (itemId, pos) => {
        setSelectedItemId(itemId);
        setSelectedType("item");
        setMenu({ visible: true, target: "item", itemId, x: pos.x, y: pos.y });
    };

    const openStageMenu = (e) => {
        if (!stage) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = getCanvasRect();
        setSelectedType("stage");
        setSelectedItemId(null);
        setMenu({
            visible: true,
            target: "stage",
            itemId: null,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const applyColorFromMenu = (color) => {
        if (!menu.visible) return;

        if (menu.target === "item" && menu.itemId) {
            setItems((prev) =>
                prev.map((i) => (i.id === menu.itemId ? { ...i, color } : i))
            );
        } else if (menu.target === "stage") {
            updateStageColor(color);
        }
        setMenu({ visible: false, target: null, itemId: null, x: 0, y: 0 });
    };

    const deleteItemFromMenu = () => {
        if (!(menu.target === "item" && menu.itemId)) return;
        setItems((prev) => prev.filter((i) => i.id !== menu.itemId));
        clearSelection();
    };

    const selectedItem =
        selectedType === "item"
            ? items.find((i) => i.id === selectedItemId)
            : null;

    const handleClearCanvas = () => {
        if (!window.confirm("Clear stage and all items?")) return;
        setStage(null);
        setItems([]);
        clearSelection();
    };

    // export PDF
    const handleExportPdf = async () => {
        if (!canvasRef.current) return;
        try {
            const canvas = await html2canvas(canvasRef.current, {
                backgroundColor: "#ffffff",
                useCORS: true,
                allowTaint: true,
                scale: 2,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const ratio = Math.min(
                pageWidth / canvas.width,
                pageHeight / canvas.height
            );
            const imgWidth = canvas.width * ratio;
            const imgHeight = canvas.height * ratio;
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
            pdf.save("decoration-layout.pdf");
        } catch (err) {
            console.error(err);
            alert("Could not export PDF. See console for details.");
        }
    };

    const pageTitle = "Decoration Planner";

    // reusable panels
    const LibraryPanel = (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/60">
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h2 className="text-sm font-semibold text-slate-50">
                        Item library
                    </h2>
                    <p className="text-[11px] text-slate-400">
                        Saved only in this browser (local library).
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleResetLibrary}
                    className="text-[11px] px-2 py-1 rounded-full border border-slate-600 text-slate-100 hover:bg-slate-800"
                >
                    Reset
                </button>
            </div>

            {/* add item */}
            <form
                onSubmit={handleAddLibraryItem}
                className="grid grid-cols-2 gap-2 text-[11px] mt-3"
            >
                <div className="col-span-2">
                    <label className="block mb-1 text-slate-200">
                        Item name
                    </label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 placeholder-slate-500 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        placeholder="e.g. Gold Sofa 3-seater"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-slate-200">
                        Type
                    </label>
                    <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                        <option value="chair">Chair</option>
                        <option value="table">Table</option>
                        <option value="sofa">Sofa</option>
                        <option value="flower">Flower</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-slate-200">
                        Tag / Notes
                    </label>
                    <input
                        type="text"
                        value={itemTag}
                        onChange={(e) => setItemTag(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 placeholder-slate-500 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        placeholder="e.g. Gold, Stage, VIP"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block mb-1 text-slate-200">
                        Image URL (optional)
                    </label>
                    <input
                        type="text"
                        value={itemImageUrl}
                        onChange={(e) => setItemImageUrl(e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 placeholder-slate-500 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        placeholder="/images/planner/my-chair.png"
                    />
                </div>
                <div className="col-span-2 flex justify-end">
                    <button
                        type="submit"
                        className="px-3 py-1.5 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300"
                    >
                        Save to library
                    </button>
                </div>
            </form>

            {/* saved items */}
            <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-1">
                {library.map((li) => (
                    <div
                        key={li.id}
                        className="rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-2 text-[11px]"
                    >
                        <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                {li.image && (
                                    <img
                                        src={li.image}
                                        alt={li.name}
                                        className="w-6 h-6 rounded object-contain bg-slate-800"
                                    />
                                )}
                                <span className="font-semibold text-slate-50 truncate">
                                    {li.name}
                                </span>
                            </div>
                            <span
                                className={
                                    "px-2 py-0.5 rounded-full border text-[10px] " +
                                    typeBadgeColor(li.type)
                                }
                            >
                                {li.type}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-1">
                            {li.tag ? `Tag: ${li.tag}` : "\u00A0"}
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[10px]">
                                <span>Qty</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantities[li.id] || "1"}
                                    onChange={(e) =>
                                        handleQtyChange(li.id, e.target.value)
                                    }
                                    className="w-12 rounded border border-slate-700 bg-slate-900 text-slate-100 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleAddOne(li)}
                                    className="px-2 py-1 rounded-full border border-slate-600 text-slate-100 hover:bg-slate-800 text-[10px]"
                                >
                                    +1
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddMany(li)}
                                    className="px-2 py-1 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 text-[10px]"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const PropertiesPanel = (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-[11px] shadow-xl shadow-black/60">
            <p className="font-semibold text-slate-50 mb-1">Properties</p>

            {!selectedType && (
                <p className="text-slate-400">
                    Click the stage or any item on the canvas. Drag to move.  
                    Use the round handles to resize and rotate. Right-click to change colours.
                </p>
            )}

            {selectedType === "stage" && stage && (
                <div className="space-y-2 mt-1">
                    <p className="font-semibold text-slate-100">
                        Stage area
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block mb-1 text-slate-400 text-[10px]">
                                Width
                            </label>
                            <input
                                type="number"
                                value={Math.round(stage.width)}
                                onChange={(e) =>
                                    setStage((prev) => ({
                                        ...prev,
                                        width: parseInt(e.target.value || "0", 10),
                                    }))
                                }
                                className="w-full rounded border border-slate-700 bg-slate-900 text-slate-100 px-1 py-1"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-slate-400 text-[10px]">
                                Height
                            </label>
                            <input
                                type="number"
                                value={Math.round(stage.height)}
                                onChange={(e) =>
                                    setStage((prev) => ({
                                        ...prev,
                                        height: parseInt(e.target.value || "0", 10),
                                    }))
                                }
                                className="w-full rounded border border-slate-700 bg-slate-900 text-slate-100 px-1 py-1"
                            />
                        </div>
                    </div>
                </div>
            )}

            {selectedType === "item" && selectedItem && (
                <div className="space-y-2 mt-1">
                    <p className="font-semibold text-slate-100">
                        {selectedItem.name}
                    </p>
                    <div>
                        <label className="block mb-1 text-slate-400 text-[10px]">
                            Rotation
                        </label>
                        <input
                            type="range"
                            min="-90"
                            max="90"
                            step="5"
                            value={selectedItem.rotation}
                            onChange={(e) =>
                                handleItemRotate(
                                    selectedItem.id,
                                    parseInt(e.target.value || "0", 10)
                                )
                            }
                            className="w-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={pageTitle} />

             <div className={`py-4 min-h-screen ${pageBg}`}>
                {/* full-width container */}
                <div className="w-full px-2 sm:px-4 lg:px-6 mx-auto overflow-hidden">
                    {/* toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                            <h1 className="text-sm sm:text-base font-semibold text-slate-50">
                                Decoration planner
                            </h1>
                            <p className="text-[11px] text-slate-400">
                                Draw the stage on the grid, then drag sofas, tables, chairs and
                                flowers from the library. Resize, rotate and recolour like a design tool.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setDrawStageMode(true)}
                                className={`text-[11px] px-3 py-1.5 rounded-full border ${
                                    drawStageMode
                                        ? "border-amber-400 bg-amber-50 text-amber-800"
                                        : "border-slate-500 text-slate-100 hover:bg-slate-800"
                                }`}
                            >
                                {drawStageMode ? "Click + drag on canvas…" : "Draw stage"}
                            </button>
                            <button
                                type="button"
                                onClick={handleExportPdf}
                                className="text-[11px] px-3 py-1.5 rounded-full border border-emerald-400 text-emerald-200 hover:bg-emerald-900/40"
                            >
                                Export PDF
                            </button>
                            <button
                                type="button"
                                onClick={handleClearCanvas}
                                className="text-[11px] px-3 py-1.5 rounded-full border border-rose-400 text-rose-200 hover:bg-rose-900/40"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* canvas + side panels */}
                    <div className="relative w-full overflow-hidden">
                        <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-xl shadow-black/50 overflow-hidden">
                            <div
                                ref={canvasRef}
                                className="relative w-full max-w-full h-[calc(100vh-120px)] rounded-2xl overflow-hidden cursor-default"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to right, rgba(148,163,184,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.18) 1px, transparent 1px)",
                                    backgroundSize: "40px 40px",
                                    backgroundColor: "#020617",
                                }}
                                onClick={handleCanvasClick}
                                onMouseDown={handleCanvasMouseDown}
                            >
                                {/* STAGE */}
                                {stage && stage.width > 4 && stage.height > 4 && (
                                    <div
                                        className={`absolute rounded-xl border-2 ${
                                            selectedType === "stage"
                                                ? "border-amber-400 ring-2 ring-amber-300/40"
                                                : "border-slate-800"
                                        }`}
                                        style={{
                                            left: stage.x,
                                            top: stage.y,
                                            width: stage.width,
                                            height: stage.height,
                                            backgroundColor: stage.color,
                                            opacity: 0.94,
                                            transform: `rotate(${stage.rotation || 0}deg)`,
                                            transformOrigin: "center center",
                                        }}
                                        onMouseDown={handleStageDragMouseDown}
                                        onClick={handleSelectStage}
                                        onContextMenu={openStageMenu}
                                    >
                                        <div className="absolute top-2 left-3 text-[10px] uppercase tracking-[0.2em] text-amber-200 pointer-events-none">
                                            Stage
                                        </div>

                                        {/* Stage rotate handle */}
                                        {selectedType === "stage" && (
                                            <div
                                                onMouseDown={handleStageRotateMouseDown}
                                                className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border border-white shadow cursor-crosshair"
                                                data-handle="stage-rotate"
                                            />
                                        )}

                                        {/* Stage resize handle */}
                                        {selectedType === "stage" && (
                                            <div
                                                onMouseDown={handleStageResizeMouseDown}
                                                className="absolute w-4 h-4 rounded-full bg-orange-400 border border-white shadow -right-2 -bottom-2 cursor-se-resize"
                                                data-handle="stage-resize"
                                            />
                                        )}
                                    </div>
                                )}

                                {/* ITEMS */}
                                {items.map((item) => (
                                    <DecorItem
                                        key={item.id}
                                        item={item}
                                        onMove={handleItemMove}
                                        onResize={handleItemResize}
                                        onRotate={handleItemRotate}
                                        onSelect={handleSelectItem}
                                        isSelected={
                                            selectedType === "item" &&
                                            selectedItemId === item.id
                                        }
                                        onContextMenu={openItemMenu}
                                        canvasRectGetter={getCanvasRect}
                                    />
                                ))}

                                {/* HINT */}
                                {!stage && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <p className="text-[11px] text-slate-400 text-center px-6">
                                            Click{" "}
                                            <span className="font-semibold">
                                                “Draw stage”
                                            </span>
                                            , then click and drag anywhere on this grid to draw
                                            your stage / main layout. Afterwards, place items
                                            from the library and use the round handles to move,
                                            resize and rotate.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Floating library + properties (desktop) */}
                        <div className="hidden lg:flex flex-col gap-3 absolute top-4 right-4 w-80 max-h-[calc(100vh-140px)] overflow-y-auto">
                            {LibraryPanel}
                            {PropertiesPanel}
                        </div>

                        {/* Panels below canvas on small screens */}
                        <div className="mt-4 lg:hidden space-y-4">
                            {LibraryPanel}
                            {PropertiesPanel}
                        </div>
                    </div>
                </div>

                {/* CONTEXT MENU (for stage + items) */}
                {menu.visible && (
                    <div
                        className="fixed z-40 text-[11px]"
                        style={{
                            left: getCanvasRect().left + menu.x,
                            top: getCanvasRect().top + menu.y,
                        }}
                    >
                        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-2 flex flex-col gap-2">
                            <div className="flex gap-1">
                                {COLOR_CHOICES.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => applyColorFromMenu(c)}
                                        className="h-5 w-5 rounded-full border border-slate-600"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                            {menu.target === "item" && (
                                <button
                                    type="button"
                                    onClick={deleteItemFromMenu}
                                    className="text-rose-300 hover:text-rose-200 text-left"
                                >
                                    Delete item
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() =>
                                    setMenu({
                                        visible: false,
                                        target: null,
                                        itemId: null,
                                        x: 0,
                                        y: 0,
                                    })
                                }
                                className="text-slate-400 hover:text-slate-200 text-left"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
