let logins = localStorage.getItem("logins")
  ? JSON.parse(localStorage.getItem("logins"))
  : [{ login: "teste", password: "123" }];
const saveData = () => {
  localStorage.setItem("logins", JSON.stringify(logins));
};
const navegacao = (pagina) => {
  fetch(pagina)
    .then((resp) => resp.text())
    .then((html) => {
      $(".main").html(html);
    });
};
navegacao("./components/login/index.html");
