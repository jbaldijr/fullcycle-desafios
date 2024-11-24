FROM golang:1.23.3-alpine3.20 AS builder

WORKDIR /app
COPY ./desafio.go .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o desafio desafio.go

FROM scratch
WORKDIR /app
COPY --from=builder /app/desafio .

CMD ["/app/desafio"]