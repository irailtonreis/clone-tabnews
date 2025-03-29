import retry from "async-retry";
async function awaitForAllServices() {
  await awaitForWebServer();

  async function awaitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http:localhost:3000/api/v1/status");
      if (response.status != 200) {
        throw Error();
      }
    }
  }
}
const orchestrator = {
  awaitForAllServices,
};

export default orchestrator;
