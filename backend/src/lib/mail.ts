import nodemailer from 'nodemailer'

const DEFAULT_EMAIL = 'info@shiseisport.nl'

const LOGO_SVG_BASE64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNS4yLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxMTE0IDEwODAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDExMTQgMTA4MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6OTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0MXtmaWxsOiMyMzFGMjA7fQ0KCS5zdDJ7ZmlsbDojRkZGRkZGO3N0cm9rZTojMjMxRjIwO3N0cm9rZS13aWR0aDo5O3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6I0ZGRkZGRjt9DQo8L3N0eWxlPg0KPHJlY3QgeD0iMjk3Ljk0IiB5PSIzNDEuNDkiIHdpZHRoPSI1MTMuNDkiIGhlaWdodD0iNDg1LjMzIi8+DQo8Zz4NCgk8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSIzMDQuNDUiIGN5PSI0ODQuMTYiIHI9IjIzOC44Ii8+DQoJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iNTU2Ljk0IiBjeT0iMzA3LjA5IiByPSIyMzguOCIvPg0KCTxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjgxMC43MyIgY3k9IjQ4Mi41MiIgcj0iMjM4LjgiLz4NCgk8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSIzOTciIGN5PSI3NjkuNzkiIHI9IjIzOC44Ii8+DQoJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iNzE5LjYzIiBjeT0iNzY2Ljg1IiByPSIyMzguOCIvPg0KPC9nPg0KPGc+DQoJPGNpcmNsZSBjeD0iNTU3Ljc5IiBjeT0iMzA4LjkxIiByPSIxOTIuNzIiLz4NCgk8Zz4NCgkJPGNpcmNsZSBjeD0iMzA5LjExIiBjeT0iNDgzLjcxIiByPSIxOTIuNzIiLz4NCgkJPGNpcmNsZSBjeD0iODA2LjQyIiBjeT0iNDgzLjcxIiByPSIxOTIuNzIiLz4NCgk8L2c+DQoJPGc+DQoJCTxjaXJjbGUgY3g9IjM5NyIgY3k9Ijc2Ni44NSIgcj0iMTkyLjcyIi8+DQoJCTxjaXJjbGUgY3g9IjcxNy43MiIgY3k9Ijc2Ni44NSIgcj0iMTkyLjcyIi8+DQoJPC9nPg0KPC9nPg0KPHJlY3QgeD0iMzE3IiB5PSIzNTEuMTkiIGNsYXNzPSJzdDEiIHdpZHRoPSI0ODMuMDgiIGhlaWdodD0iNDY3LjM1Ii8+DQo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMzIwLjE1LDI1MC40Ii8+DQo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjMyMC4xNSwyNTAuNCAzMzAuMzksMjUxLjEgMzIzLjAzLDI5MS40OSAzMTQuMDMsMjkxLjA1IDMxMy43NywyNzguNyAzMTgsMjUxLjQ1ICIvPg0KPHBhdGggZD0iTTc3Mi44OCwyNDEuMzIiLz4NCjxwb2x5Z29uIGNsYXNzPSJzdDMiIHBvaW50cz0iNzgxLjYzLDI0MC45MyA3ODQuMTMsMjUwLjI4IDc2NC40MSwyNTMuNzggNzU0LjMxLDI1NS41MSA3NDQuMzksMjU4LjEgNzQzLjcsMjU3Ljk0IDc0My4wNSwyNTUuNjIgDQoJNzQyLjUxLDI1My43OCA3NDEuNTcsMjUwLjczIDc0MS4xMSwyNDkuMjcgNzQ1Ljg0LDI0Ni42NCA3NTIuMywyNDQuNjYgNzYzLjIzLDI0MS4zOCA3NzcuNSwyMzkuOTMgNzgxLDI0MC40MSAiLz4NCjxnPg0KCTxjaXJjbGUgY3g9IjU1Ny44MiIgY3k9IjMwOC42NiIgcj0iMTkyLjcyIi8+DQoJPGc+DQoJCTxjaXJjbGUgY3g9IjMwOS4xNCIgY3k9IjQ4My40NiIgcj0iMTkyLjcyIi8+DQoJCTxjaXJjbGUgY3g9IjgwNi40NSIgY3k9IjQ4My40NiIgcj0iMTkyLjcyIi8+DQoJPC9nPg0KCTxnPg0KCQk8Y2lyY2xlIGN4PSIzOTcuMDIiIGN5PSI3NjYuNiIgcj0iMTkyLjcyIi8+DQoJCTxjaXJjbGUgY3g9IjcxNy43NSIgY3k9Ijc2Ni42IiByPSIxOTIuNzIiLz4NCgk8L2c+DQo8L2c+DQo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9Ijk0NC43Miw2NzQuNjkgOTM2LjA3LDY4MC4wNCA5MjkuNjMsNjY4LjYyIDkyNC4xNSw2NTkuNDYgOTE5Ljk0LDY0OC4zNiA5MTcuMDcsNjQyLjIzIDkxNy4zNCw2NDEuMzMgDQoJOTI0LjYxLDYzNS45NCA5MjkuMjUsNjM4LjQ5IDk0MC42NCw2NDkuMjQgOTQyLjk3LDY2My43IDk0NS4yNyw2NjkuOTkgIi8+DQo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjE3MS43NCw2NzcuMzYgMTgwLjc5LDY4My4zOSAxODcuMTMsNjc0LjI1IDE5MC44OSw2NjUuMzMgMTkzLjIxLDY1OS40MiAxOTQuMDcsNjU4LjAyIDIwMS4xNyw2NDQuMDIgDQoJMjAwLjA2LDY0Mi42MyAxOTIuNzUsNjM3LjM0IDE4Ny42Nyw2MzkuMTkgMTgzLjQyLDY0Ni40NyAxODEuOTMsNjUwLjc1IDE3OS4zMSw2NTcuMTggMTc3LjYyLDY1OS44MSAxNzMuOTMsNjY1LjI0IDE3Mi4yMyw2NzIuMDMgDQoJIi8+DQo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjU1My4xLDk0NC40IDU2My4xLDkzNS42MiA1NjEuNjcsOTMzLjE4IDUzMS45LDkwNS4yOCA1MzAuNzEsOTA1LjYzIDUyNC4wNSw5MTEuNzYgNTI0LjA3LDkxMi4zMSANCgk1NDUuNjgsOTQxLjg1ICIvPg0KPGc+DQoJPHJlY3QgeD0iODI1LjI3IiB5PSI5MTUuMjIiIHRyYW5zZm9ybT0ibWF0cml4KDAuOTk0NCAwLjEwNTQgLTAuMTA1NCAwLjk5NDQgMTAxLjgwODkgLTg1LjgzMzkpIiB3aWR0aD0iNzUuMzkiIGhlaWdodD0iMTAuMTMiLz4NCgk8cmVjdCB4PSI3OTEuMTgiIHk9Ijk0Mi42MiIgdHJhbnNmb3JtPSJtYXRyaXgoMC4xMDU0IC0wLjk5NDQgMC45OTQ0IDAuMTA1NCAtMjAyLjQ3NTIgMTY3MC4yOTE1KSIgd2lkdGg9IjcxLjg2IiBoZWlnaHQ9IjEwLjEzIi8+DQo8L2c+DQo8Zz4NCgk8cmVjdCB4PSIyNjMuNyIgeT0iOTUwLjE4IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjEwMDUgMC45OTQ5IC0wLjk5NDkgMC4xMDA1IDEyMTkuOTI0NiA1NjEuMTE3NSkiIHdpZHRoPSI3MS44NiIgaGVpZ2h0PSIxMC4xMyIvPg0KCTxyZWN0IHg9IjIxOS43NiIgeT0iOTIyLjk1IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjk5NDkgLTAuMTAwNSAwLjEwMDUgMC45OTQ5IC05MS45NjEzIDMwLjkwMjUpIiB3aWR0aD0iODEuODUiIGhlaWdodD0iMTAuMTMiLz4NCjwvZz4NCjxnPg0KCTxyZWN0IHg9IjYyLjQ0IiB5PSI0NDcuOTEiIHRyYW5zZm9ybT0ibWF0cml4KC0wLjkxMDMgMC40MTQgLTAuNDE0IC0wLjkxMDMgMzc1LjQxNTcgODI0LjU5NTMpIiB3aWR0aD0iNzEuODYiIGhlaWdodD0iMTAuMTMiLz4NCgk8cmVjdCB4PSI3MC43NiIgeT0iNDAyLjI4IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQxNCAwLjkxMDMgLTAuOTEwMyAwLjQxNCA0MzYuMjU4NiAxMzcuMDY0NSkiIHdpZHRoPSI4MS44NSIgaGVpZ2h0PSIxMC4xMyIvPg0KPC9nPg0KPGc+DQoJPHJlY3QgeD0iOTgxLjc1IiB5PSI0NDguMjkiIHRyYW5zZm9ybT0ibWF0cml4KDAuOTEwMyAwLjQxNCAtMC40MTQgMC45MTAzIDI3OC45NTY2IC0zODAuNjA4MikiIHdpZHRoPSI3MS44NiIgaGVpZ2h0PSIxMC4xMyIvPg0KCTxyZWN0IHg9Ijk2My40NCIgeT0iNDAyLjY2IiB0cmFuc2Zvcm09Im1hdHJpeCgtMC40MTQgMC45MTAzIC0wLjkxMDMgLTAuNDE0IDE3OTEuMjg0MyAtMzM3Ljc2MTcpIiB3aWR0aD0iODEuODUiIGhlaWdodD0iMTAuMTMiLz4NCjwvZz4NCjxwb2x5Z29uIGNsYXNzPSJzdDMiIHBvaW50cz0iOTQuMDcsMzgwLjg2IDkwLjMzLDM3Mi42NSA4OC40NiwzNjguNTUgODIuNDIsMzc4LjczIDY5LjE2LDM5Ny4xMSA1OC4yMiw0MzUuNyA1Ny42OSw0NjQuNTMgDQoJNjAuNzYsNDY0LjEgNjEuMzUsNDY0LjE1IDYzLjU2LDQ2My4yMyA3Mi4wNiw0NTkuMzcgODQuOSw0MzIuMDkgOTQuNzEsMzg2LjYgIi8+DQo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjEwMjAuOSwzODMuNjEgMTAyNS45MiwzNzIuNTcgMTAyNy44NSwzNjguMDEgMTAzNi41OCwzNzguNjggMTA0NS4zMSwzOTguMTkgMTA2NS4zNiw0NjIgDQoJMTA1NC4xNSw0NjQuMjYgMTA1Mi40OCw0NjMuNjEgMTA0My4xMyw0NTkuMzYgMTAyMS45MywzOTcuNzYgIi8+DQo8cG9seWxpbmUgY2xhc3M9InN0MyIgcG9pbnRzPSI4ODcuNTMsOTI3Ljk4IDg5OS45Miw5MjkuMjkgOTA5LjE1LDkzMC4xNCA4OTguMzQsOTQ4LjQ2IDg0MC42Nyw5ODMuODIgODI3LjY2LDk4NS41NCAiLz4NCjxwb2x5Z29uIGNsYXNzPSJzdDMiIHBvaW50cz0iODMwLjQ5LDk2My44NCA4MjguODMsOTc5LjU0IDgyOC4zNiw5ODMuOTUgODI4LjEzLDk4NS43NiA4NDguNzUsOTcwLjM4IDg2MS4xNSw5NTUuNDcgODU5Ljg1LDk1MS41OSANCgk4NDEuMzEsOTU1Ljk0ICIvPg0KPHBhdGggY2xhc3M9InN0MyIgZD0iTTI5Ny4xOSw5ODEuNTJjMCwwLDAuNTIsNS4xNiwwLjU2LDUuNTNzMC40NSw0LjQ1LDAuNDUsNC40NWwwLjE5LDEuODFsLTI4LjI3LTcuNmw1LjA4LTE4LjgybDAuMDYtMC4yMw0KCUwyOTcuMTksOTgxLjUyeiIvPg0KPHBvbHlnb24gY2xhc3M9InN0MyIgcG9pbnRzPSIyNDYuNjMsOTQwLjQgMjI0LjI3LDk1Ny42NCAyNzAuMTMsOTg1LjcyIDI3OS4zNCw5NjcuMzQgMjc1LjI1LDk1Ni40NiAiLz4NCjxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0yMzYuMyw5MzUuNTdsLTEzLjI0LDEuMzRsLTIuNTksMC4yNmwtMi43OCwwLjh2Ny4yOGMwLDAsNS4wNCw3LjczLDUuMjMsNy43NmMwLjE5LDAuMDMsMjEuMSwxLjU2LDIxLjEsMS41Ng0KCWwzLjcyLTEyLjMxbC0xLjctMy41M0wyMzYuMyw5MzUuNTd6Ii8+DQo8Zz4NCgk8cmVjdCB4PSI1NDIuNyIgeT0iOTQuNDUiIHRyYW5zZm9ybT0ibWF0cml4KDAuNzA2NiAtMC43MDc2IDAuNzA3NiAwLjcwNjYgMTAwLjA1MzQgNDQwLjMzNTgpIiB3aWR0aD0iNzYuNjMiIGhlaWdodD0iMTAuMTMiLz4NCgk8cmVjdCB4PSI0OTUuNDMiIHk9Ijk0LjQ2IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzYgMC43MDY2IC0wLjcwNjYgMC43MDc2IDIyNi4zODIgLTM0OC4wNTEzKSIgd2lkdGg9Ijc2LjY3IiBoZWlnaHQ9IjEwLjEzIi8+DQo8L2c+DQo8cG9seWdvbiBjbGFzcz0ic3QzIiBwb2ludHM9IjUxNy44Miw3Ni40NSA1MTEuODYsNzAuNSA1MTAuMjEsNjguODUgNTA5LjExLDY3Ljc1IDUxNi4yMyw2NC42OCA1MzguMjQsNjEuNzEgNTU0LjE0LDYxLjM5IA0KCTU5OS4yMyw2Mi45MSA1ODguMDIsNzguNjQgNTM4Ljg3LDc5LjA3ICIvPg0KPHBvbHlnb24gY2xhc3M9InN0MyIgcG9pbnRzPSI1OTYuNDYsNzYuODcgNjAyLjM1LDcwLjk4IDYwNC41LDY4LjgzIDYwNS45LDY3LjQ1IDU5NC41Myw2NC40MyA1ODcuNTUsNzQuOTcgNTkyLjcsNzcuMjEgIi8+DQo8cmVjdCB4PSIzMTgiIHk9IjM1NyIgd2lkdGg9IjQ3OCIgaGVpZ2h0PSI0NzgiLz4NCjxyZWN0IHg9IjcxMy41NSIgeT0iMzY4LjAxIiBjbGFzcz0ic3QzIiB3aWR0aD0iNjkuODQiIGhlaWdodD0iMjA0Ljc5Ii8+DQo8cmVjdCB4PSI3MTMuNTUiIHk9IjU5OCIgY2xhc3M9InN0MyIgd2lkdGg9IjY5Ljg0IiBoZWlnaHQ9IjIwNC42Ii8+DQo8Zz4NCgk8cmVjdCB4PSI1MjYuODciIHk9IjM2OC4wMSIgY2xhc3M9InN0MyIgd2lkdGg9IjY5Ljg0IiBoZWlnaHQ9IjIwNC43OSIvPg0KCTxyZWN0IHg9IjYxOS4yMSIgeT0iMzY4LjAxIiBjbGFzcz0ic3QzIiB3aWR0aD0iNjkuODQiIGhlaWdodD0iMjA0Ljc5Ii8+DQoJPHJlY3QgeD0iNTk2LjcyIiB5PSI0NDQuNzUiIGNsYXNzPSJzdDMiIHdpZHRoPSIyMy41IiBoZWlnaHQ9IjUxLjQxIi8+DQo8L2c+DQo8Zz4NCgk8cmVjdCB4PSIzMzEuMTMiIHk9IjQ0NC43NSIgY2xhc3M9InN0MyIgd2lkdGg9IjE2OS44NyIgaGVpZ2h0PSI1MS40MSIvPg0KCTxyZWN0IHg9IjMzMS4xMyIgeT0iMzY4LjEyIiBjbGFzcz0ic3QzIiB3aWR0aD0iMTY5Ljg3IiBoZWlnaHQ9IjU5LjYiLz4NCgk8cmVjdCB4PSIzMzEuMTMiIHk9IjUxMy4wOSIgY2xhc3M9InN0MyIgd2lkdGg9IjE2OS44NyIgaGVpZ2h0PSI1OS42Ii8+DQoJPHJlY3QgeD0iMzMxLjEzIiB5PSI0MjcuNzIiIGNsYXNzPSJzdDMiIHdpZHRoPSI4NC45MyIgaGVpZ2h0PSIxNy4wMyIvPg0KCTxyZWN0IHg9IjQyNC45MSIgeT0iNDk2LjE2IiBjbGFzcz0ic3QzIiB3aWR0aD0iNzYuMSIgaGVpZ2h0PSIxNi45MiIvPg0KPC9nPg0KPGc+DQoJPHJlY3QgeD0iMzMxLjEzIiB5PSI2NzQuNjYiIGNsYXNzPSJzdDMiIHdpZHRoPSIxNjkuODciIGhlaWdodD0iNTEuNDEiLz4NCgk8cmVjdCB4PSIzMzEuMTMiIHk9IjU5OC4wMiIgY2xhc3M9InN0MyIgd2lkdGg9IjE2OS44NyIgaGVpZ2h0PSI1OS42Ii8+DQoJPHJlY3QgeD0iMzMxLjEzIiB5PSI3NDIuOTkiIGNsYXNzPSJzdDMiIHdpZHRoPSIxNjkuODciIGhlaWdodD0iNTkuNiIvPg0KCTxyZWN0IHg9IjMzMS4xMyIgeT0iNjU3LjYzIiBjbGFzcz0ic3QzIiB3aWR0aD0iODQuOTMiIGhlaWdodD0iMTcuMDMiLz4NCgk8cmVjdCB4PSI0MjQuOTEiIHk9IjcyNi4wNyIgY2xhc3M9InN0MyIgd2lkdGg9Ijc2LjEiIGhlaWdodD0iMTYuOTIiLz4NCjwvZz4NCjxnPg0KCTxyZWN0IHg9IjUyNi44NyIgeT0iNTk4IiBjbGFzcz0ic3QzIiB3aWR0aD0iNjkuODQiIGhlaWdodD0iMjA0LjQiLz4NCgk8Zz4NCgkJPHJlY3QgeD0iNTI2Ljg3IiB5PSI2NzQuNzEiIGNsYXNzPSJzdDMiIHdpZHRoPSIxNjIuMTEiIGhlaWdodD0iNTEuNDEiLz4NCgkJPHJlY3QgeD0iNTI2Ljg3IiB5PSI1OTguMDciIGNsYXNzPSJzdDMiIHdpZHRoPSIxNjIuMTEiIGhlaWdodD0iNTkuNiIvPg0KCQk8cmVjdCB4PSI1MjYuODciIHk9Ijc0My4wNCIgY2xhc3M9InN0MyIgd2lkdGg9IjE2Mi4xMSIgaGVpZ2h0PSI1OS42Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo='

/**
 * Wraps email body content in a professional branded template.
 */
export function emailTemplate(body: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background-color:#1a1a1a;padding:28px 32px;text-align:center;">
            <img src="data:image/svg+xml;base64,${LOGO_SVG_BASE64}" alt="Shi-Sei Sport" width="56" height="54" style="display:inline-block;vertical-align:middle;">
            <span style="display:inline-block;vertical-align:middle;margin-left:14px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Shi-Sei Sport</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color:#fafafa;border-top:1px solid #e5e5e5;padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#888;">Shi-Sei Sport &mdash; Judovereniging Den Haag</p>
            <p style="margin:6px 0 0;font-size:12px;color:#aaa;">info@shiseisport.nl</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/**
 * Helper to build a styled section heading for email content.
 */
export function emailSection(title: string): string {
  return `<h3 style="margin:24px 0 12px;font-size:15px;font-weight:600;color:#E60000;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #E60000;padding-bottom:6px;">${title}</h3>`
}

/**
 * Helper to build a data table row for email content.
 */
export function emailRow(label: string, value: string): string {
  return `<tr>
  <td style="padding:10px 12px;font-size:14px;font-weight:600;color:#555;white-space:nowrap;border-bottom:1px solid #f0f0f0;width:40%;">${label}</td>
  <td style="padding:10px 12px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0f0f0;">${value}</td>
</tr>`
}

/**
 * Wraps rows in a styled table.
 */
export function emailTable(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`
}

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  })
}

export async function sendMail(options: {
  to?: string
  subject: string
  html: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer | Uint8Array
    contentType?: string
  }>
}) {
  const transporter = createTransporter()
  await transporter.verify()
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || `noreply@shiseisport.nl`,
    to: options.to || process.env.CONTACT_EMAIL || DEFAULT_EMAIL,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments,
  })
}
