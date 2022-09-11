$("#btn-cadastrar").click((e) => {
  e.preventDefault();
  const login = $("#login").val();
  const password = $("#pass").val();
  logins.push({ login, password });
  saveData();
  navegacao("./components/login/index.html");
});
