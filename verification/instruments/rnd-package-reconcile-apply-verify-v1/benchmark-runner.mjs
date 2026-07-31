import { spawn } from "node:child_process";

export async function runBenchmark({ command, cwd = process.cwd(), env = process.env, receiptPath = null }) {
  if (!Array.isArray(command) || command.length === 0) throw new Error("BENCHMARK_COMMAND_INVALID");
  const [program, ...args] = command;
  const result = await new Promise((resolve) => {
    const child = spawn(program, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => resolve({ exitCode: null, error: error.message, stdout, stderr }));
    child.on("close", (exitCode) => resolve({ exitCode, error: null, stdout, stderr }));
  });
  return Object.freeze({
    pass: result.exitCode === 0 && !result.error,
    ...result,
    receiptPath
  });
}
