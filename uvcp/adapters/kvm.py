import libvirt

class KVMAdapter:
    name = "kvm"

    def __init__(self):
        self.conn = libvirt.open("qemu:///system")
        if self.conn is None:
            raise RuntimeError("libvirt open failed (qemu:///system)")

    def list_targets(self):
        # Return list of domain names
        names = []
        for dom_id in self.conn.listDomainsID():
            dom = self.conn.lookupByID(dom_id)
            names.append(dom.name())
        for name in self.conn.listDefinedDomains():
            names.append(name)
        # stable unique
        return sorted(list(set(names)))

    def select(self, target: str):
        return self.conn.lookupByName(target)

    def admissible(self, op: str, dom) -> bool:
        # v0 permissive; keep it honest and simple
        return True

    def commit(self, op: str, dom):
        if op == "start":
            dom.create()
        elif op == "stop":
            dom.shutdown()
        elif op == "reboot":
            dom.reboot()
        else:
            raise ValueError(f"unsupported op: {op}")
        return {"op": op}

    def verify(self, op: str, dom) -> bool:
        return bool(dom.isActive())

    def snapshot(self, dom) -> dict:
        return {
            "name": dom.name(),
            "active": bool(dom.isActive()),
        }
