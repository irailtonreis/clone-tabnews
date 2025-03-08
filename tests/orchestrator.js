import retry from "async-retry";
async function awaitForAllServices() {
  await awaitForWebServer();

  async function awaitForWebServer(params) {
    return retry(fetchStatusPage, {
      retries: 100,
    });

    async function fetchStatusPage(params) {
      const response = await fetch("http:localhost:3000/api/v1/status");
      const responseBody = await response.json();
    }
  }
}

export default {
  awaitForAllServices,
};
