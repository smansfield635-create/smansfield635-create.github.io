from __future__ import annotations
import hashlib, io
from typing import Any
import networkx as nx
from PIL import Image
from model import ExternalSystem, Outcome

class GraphSystem(ExternalSystem):
    system_id = "SYS_WEIGHTED_GRAPH_ROUTING"
    package = "networkx"
    relations = ("R21", "R22", "R23")
    decoys = ("R24", "R25")
    @staticmethod
    def _base_graph() -> nx.DiGraph:
        graph = nx.DiGraph(); graph.add_weighted_edges_from([("S","A",1),("A","B",1),("B","T",1),("X","Y",1),("Y","Z",1)])
        return graph
    @staticmethod
    def _outcome(graph: nx.DiGraph, provenance: str, route_id: str) -> Outcome:
        try: path = nx.shortest_path(graph, "S", "T", weight="weight"); generic = True
        except nx.NetworkXNoPath: path, generic = [], False
        return Outcome(generic, path == ["S","A","B","T"], provenance, route_id, {"path":path})
    def baseline(self) -> Outcome: return self._outcome(self._base_graph(), "endogenous", "original-bridge-route")
    def ablate(self, relation: str) -> Outcome:
        graph = self._base_graph(); edge = {"R21":("S","A"),"R22":("A","B"),"R23":("B","T"),"R24":("X","Y"),"R25":("Y","Z")}[relation]
        graph.remove_edge(*edge); return self._outcome(graph, "endogenous", "original-bridge-route")
    def support_after_ablation(self, relation: str) -> Outcome:
        internal = self.ablate(relation)
        return Outcome(True, internal.original_challenge_pass, "external_support", "delivery-oracle", {"internal_path":internal.evidence["path"]})
    def unrelated_capacity_after_ablation(self, relation: str) -> Outcome:
        graph = self._base_graph(); edge = {"R21":("S","A"),"R22":("A","B"),"R23":("B","T")}[relation]; graph.remove_edge(*edge)
        for i in range(100): graph.add_edge(f"U{i}", f"V{i}", weight=1)
        return self._outcome(graph, "endogenous", "original-bridge-route")
    def substitute(self) -> Outcome:
        graph = self._base_graph(); graph.remove_edge("A","B"); graph.add_weighted_edges_from([("S","C",1),("C","D",1),("D","T",1)])
        return self._outcome(graph, "functional_substitute", "substitute-route")
    def restore(self, relation: str) -> Outcome: return self.baseline()
    def withdrawal_after_support(self, relation: str) -> Outcome: return self.ablate(relation)

class ImageSystem(ExternalSystem):
    system_id = "SYS_IMAGE_IDENTITY_ROUNDTRIP"
    package = "Pillow"
    relations = ("R31", "R32", "R33")
    decoys = ("R34", "R35")
    def __init__(self) -> None:
        self.image = Image.new("RGBA", (16,16), (255,255,255,0)); pixels = self.image.load()
        for y in range(4,12):
            for x in range(4,12): pixels[x,y] = (20,80,200,255)
        self.original_bytes = self.image.tobytes(); self.visible_ref = self._composite_hash(self.image)
    @staticmethod
    def _composite_hash(image: Image.Image) -> str:
        rgba = image.convert("RGBA"); background = Image.new("RGBA", rgba.size, (255,255,255,255)); composite = Image.alpha_composite(background, rgba).convert("RGB")
        return hashlib.sha256(composite.tobytes()).hexdigest()
    @staticmethod
    def _roundtrip(image: Image.Image, fmt: str = "PNG", **save_kw: Any) -> tuple[Image.Image, bytes]:
        buffer = io.BytesIO(); image.save(buffer, format=fmt, **save_kw); raw = buffer.getvalue(); buffer.seek(0); output = Image.open(buffer); output.load(); return output, raw
    def _assess(self, output: Image.Image, raw: bytes, provenance: str, route_id: str) -> Outcome:
        visible = self._composite_hash(output) == self.visible_ref; original = output.mode == "RGBA" and output.tobytes() == self.original_bytes and raw.startswith(b"\x89PNG")
        return Outcome(visible, original, provenance, route_id, {"mode":output.mode,"encoded_sha256":hashlib.sha256(raw).hexdigest()})
    def baseline(self) -> Outcome:
        output, raw = self._roundtrip(self.image, "PNG"); return self._assess(output, raw, "endogenous", "png-rgba-lossless")
    def ablate(self, relation: str) -> Outcome:
        if relation == "R31": output, raw = self._roundtrip(self.image.convert("RGB"), "PNG")
        elif relation == "R32": output, raw = self._roundtrip(self.image.convert("RGB"), "JPEG", quality=100, subsampling=0)
        elif relation == "R33":
            image = self.image.copy(); image.putalpha(Image.new("L", image.size, 255)); output, raw = self._roundtrip(image, "PNG")
        elif relation == "R34": output, raw = self._roundtrip(self.image, "PNG", dpi=(72,72))
        else: output, raw = self._roundtrip(self.image, "PNG", compress_level=9)
        return self._assess(output, raw, "endogenous", "image-roundtrip")
    def support_after_ablation(self, relation: str) -> Outcome:
        internal = self.ablate(relation); return Outcome(True, internal.original_challenge_pass, "external_support", "cached-preview", {"internal_visible":internal.visible_pass})
    def unrelated_capacity_after_ablation(self, relation: str) -> Outcome:
        for size in range(1,40): Image.new("RGB", (size,size), (size,size,size)).resize((64,64))
        return self.ablate(relation)
    def substitute(self) -> Outcome:
        output, raw = self._roundtrip(self.image.convert("RGB"), "PNG"); return self._assess(output, raw, "functional_substitute", "rgb-png-substitute")
    def restore(self, relation: str) -> Outcome: return self.baseline()
    def withdrawal_after_support(self, relation: str) -> Outcome: return self.ablate(relation)
