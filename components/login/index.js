$("#btn-login").click((e) => {
  e.preventDefault();
  const login = $("#login").val();
  const password = $("#pass").val();
  let auth = false;
  logins.forEach((logi) => {
    if (logi.login === login && logi.password === password) {
      auth = true;
      navegacao("./components/dashboard/index.html");
    }
  });
  if (!auth) {
    alert("Não autorizado, verifique o login e a senha");
  }
});

$("#cadastrar").click((e) => {
  e.preventDefault();
  navegacao("./components/register/index.html");
});
