import retry from "async-retry";
async function awaitForAllServices() {
  await awaitForWebServer();

  async function awaitForWebServer(params) {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage(ball, tryNumber) {
      const response = await fetch("http:localhost:3000/api/v1/status");
      if (response.status != 200) {
        throw Error();
      }
    }
  }
}

export default {
  awaitForAllServices,
};
