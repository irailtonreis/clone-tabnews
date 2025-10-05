const { spawn } = require("child_process");

const processes = [];

function runNpm(script) {
  return new Promise((resolve, reject) => {
    const p = spawn("npm", ["run", script], { stdio: "inherit", shell: true });
    processes.push(p);

    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Script ${script} falhou com código ${code}`));
    });
  });
}

function runDirect(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: true });
    processes.push(p);

    p.on("exit", (code, signal) => {
      if (signal) {
        console.log(`ℹ️ ${cmd} encerrado por sinal ${signal}`);
        resolve();
      } else if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Comando ${cmd} falhou com código ${code}`));
      }
    });
  });
}

function cleanup() {
  console.log("\n🛑 Encerrando... executando postdev...");
  spawn("npm", ["run", "services:stop"], { stdio: "inherit", shell: true });
  processes.forEach((p) => p.kill("SIGTERM"));
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);

(async () => {
  try {
    await runNpm("services:up");
    await runNpm("services:wait:database");
    await runNpm("migrations:up");
    await runDirect("npx", ["next", "dev"]);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
