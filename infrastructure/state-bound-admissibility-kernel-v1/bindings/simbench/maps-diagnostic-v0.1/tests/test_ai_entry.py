from __future__ import annotations

import argparse
from contextlib import redirect_stdout
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from ai_entry import command_compute_batch  # noqa: E402


class AiEntryTests(unittest.TestCase):
    def test_batch_entry_preserves_valid_and_uninterpretable_rows(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "output.json"
            receipt = Path(directory) / "receipt.json"
            args = argparse.Namespace(
                input=str(ROOT / "fixtures" / "example_batch.json"),
                output=str(output),
                receipt=str(receipt),
            )
            with redirect_stdout(io.StringIO()):
                self.assertEqual(command_compute_batch(args), 0)
            rows = json.loads(output.read_text(encoding="utf-8"))
            record = json.loads(receipt.read_text(encoding="utf-8"))
            self.assertEqual([row["measurement_state"] for row in rows], ["VALID", "UNINTERPRETABLE"])
            self.assertEqual(record["row_count"], 2)
            self.assertEqual(record["valid_count"], 1)
            self.assertEqual(record["uninterpretable_count"], 1)
            self.assertEqual(record["parent_execution_disposition"], "DO_NOT_EXECUTE")


if __name__ == "__main__":
    unittest.main()
