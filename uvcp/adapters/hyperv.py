import os
import winrm

class HyperVAdapter:
    name = "hyperv"

    """
    Requires env vars on the UVCP server:
      HYPERV_HOST, HYPERV_USER, HYPERV_PASS
    Optional:
      HYPERV_TRANSPORT = ntlm|kerberos (default ntlm)
      HYPERV_SCHEME    = http|https (default http)
      HYPERV_PORT      = 5985|5986 (default 5985)
    """

    def __init__(self):
        host = os.environ.get("HYPERV_HOST", "")
        user = os.environ.get("HYPERV_USER", "")
        pw   = os.environ.get("HYPERV_PASS", "")
        transport = os.environ.get("HYPERV_TRANSPORT", "ntlm")
        scheme = os.environ.get("HYPERV_SCHEME", "http")
        port = os.environ.get("HYPERV_PORT", "5985")

        if not host or not user or not pw:
            raise RuntimeError("Missing Hyper-V env vars: HYPERV_HOST/HYPERV_USER/HYPERV_PASS")

        endpoint = f"{scheme}://{host}:{port}/wsman"
        self.session = winrm.Session(endpoint, auth=(user, pw), transport=transport)

    def _ps(self, script: str) -> str:
        r = self.session.run_ps(script)
        if r.status_code != 0:
            err = (r.std_err or b"").decode(errors="ignore")
            out = (r.std_out or b"").decode(errors="ignore")
            raise RuntimeError(err or out or "Hyper-V PowerShell failed")
        return (r.std_out or b"").decode(errors="ignore").strip()

    def list_targets(self):
        out = self._ps("Get-VM | Select-Object -ExpandProperty Name")
        names = [x.strip() for x in out.splitlines() if x.strip()]
        return sorted(list(set(names)))

    def select(self, target: str):
        _ = self._ps(f'Get-VM -Name "{target}" | Select-Object -ExpandProperty Name')
        return target

    def admissible(self, op: str, target: str) -> bool:
        return True

    def commit(self, op: str, target: str):
        if op == "start":
            self._ps(f'Start-VM -Name "{target}" | Out-Null')
        elif op == "stop":
            self._ps(f'Stop-VM -Name "{target}" -Force | Out-Null')
        elif op == "reboot":
            self._ps(f'Restart-VM -Name "{target}" -Force | Out-Null')
        else:
            raise ValueError(f"unsupported op: {op}")
        return {"op": op}

    def verify(self, op: str, target: str) -> bool:
        state = self._ps(f'(Get-VM -Name "{target}").State.ToString()')
        return state.lower() == "running"

    def snapshot(self, target: str) -> dict:
        state = self._ps(f'(Get-VM -Name "{target}").State.ToString()')
        return {"name": target, "state": state}
