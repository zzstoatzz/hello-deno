export function layout(content: string = '') {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Particle System</title>
    <link rel="stylesheet" href="/static/css/styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500&display=swap">
  </head>
  <body>
    ${content}
  </body>
</html>`;
} 