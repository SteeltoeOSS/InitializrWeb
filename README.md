# Steeltoe InitializrWeb

Steeltoe Initializr UI reference implementation

## About

This implementation largely steals from the [Spring Initializr Client](https://github.com/spring-io/start.spring.io).
The primary differences between the two implementations are branding and domain metadata.
Branding differences include reference URLs, color schemes, and logos.
Domain metadata includes metadata differences such as "Java version" vs ".NET version" and "Spring Boot" vs "Steeltoe."
A list of files that are known to diverge from Spring is available [here](./Upstream.md)

## Docker

### Running Tests

The Dockerfile includes a multi-stage build with a dedicated test stage. To run tests in Docker:

```bash
# Build the test image
docker build --target test -t initializr-web-test .

# Run the tests
docker run --rm initializr-web-test
```

### Building the Production Image

You can build the Docker image locally using the following command:

```bash
docker build -t initializr-web .
```

### Running the Image

To run the image locally, you need to provide the `INITIALIZR_SERVICE_HOST` and `INITIALIZR_SERVICE_URI` environment variables. These point to the backend API service.

**Bash:**
```bash
docker run -p 8080:80 \
  -e INITIALIZR_SERVICE_HOST="start.steeltoe.io" \
  -e INITIALIZR_SERVICE_URI="https://start.steeltoe.io/api" \
  initializr-web
```

**PowerShell:**
```powershell
docker run -p 8080:80 `
  -e INITIALIZR_SERVICE_HOST="start.steeltoe.io" `
  -e INITIALIZR_SERVICE_URI="https://start.steeltoe.io/api" `
  initializr-web
```

The application will be accessible at `http://localhost:8080`.

## Deploying

There are two endpoints that the Web UI uses to 1) populate its UI, and 2) generate projects:

* `/api/config/projectMetadata`
* `/api/project`

For local development, these endpoints are implemented in the development webpack configuration in [start-client/webpack.dev.js](start-client/webpack.dev.js).

In a remote deployment, those endpoints are implemented by the [Initializr API](https://github.com/SteeltoeOSS/InitializrApi).
The deployment should be frontended by an HTTP router that forwards requests to these two endpoints to the API server.
A sample Kubernetes ingress configuration:

```yaml
---
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: initializr-ingress
  namespace: initializr
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
  - host: my.initializr
    http:
      paths:
      - path: /(.*)
        backend:
          serviceName: initializr-web
          servicePort: 80
      - path: /(api/.*)
        backend:
          serviceName: initializr-api
          servicePort: 80
```
