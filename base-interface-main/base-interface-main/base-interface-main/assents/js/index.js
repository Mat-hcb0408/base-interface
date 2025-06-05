
"use strict";
//API GET
fetch('http://localhost:8080/alunos', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
})
  .then(response => response.json())
  .then(data => {
    addlinha(data);
  })
  .catch(error => {
    console.log(error);
  });


//Adicionar Linha na Tabela
function addlinha(dadosAPI) {
  const tabela = document.getElementById('tabelaCorpo');
  dadosAPI.forEach(element => {
    const linha = document.createElement('tr');
    //Adicionando HTML
    linha.innerHTML = `
              <td class="px-4 py-2">${element.id}</td>
              <td class="px-4 py-2">${element.nome}</td>
              <td class="px-4 py-2">${element.email}</td>
              <td class="px-4 py-2">
              <button  class="bg-yellow-500 text-white px-2 py-1 rounded mr-2" 
              onclick="editar(this,${element.id})">
              editar</button>
              <button  class="bg-red-500 text-white px-2 py-1 rounded" 
              onclick="remover(this,${element.id})">
              remover</button>
              </td>
        `;

    tabela.appendChild(linha);
  });
}

//Cadastrar Novas pessoas do formulario
function cadastrar() {
  event.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  
  if (nome && email) {
    //API POST  
    fetch('http://localhost:8080/alunos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "nome": nome, "email": email })
    })

      .then(response => response.json())
      .then(data => {
        addlinha([data])

        document.getElementById('nome').value = "";
        document.getElementById('email').value = "";

        Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Cadastro feito com sucesso'
    });
      })
      .catch(error => {
        console.error("Erro ao enviar dados:", error);
      });   
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Falta dados para cadastar'
    });
  }
}

//Remover Alguma Linha da tabela
function remover(botao) {
  Swal.fire({
    icon: 'question',
    title: 'Você tem certeza?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não'
  }).then((result) => {
    if (result.isConfirmed) {
      const linharemover = botao.closest('tr');
      const id=linharemover.querySelector('td').innerText
      fetch(`http://localhost:8080/alunos/${id}`,{
        method:"DELETE",
        headers:{
          'Content-Type':'application/json'
        }
      })
      .then(response => {
        if(response.ok){
          const linharemover=botao.closest('tr')
        linharemover.remove();
        Swal.fire('Confirmado!', '', 'success');
        }else{
          throw new Error("Falha no servidor")
        }
    })

      .catch(error => {
        console.error("Erro ao enviar dados:");
        Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Erro no banco de dados'
    });
      });
    
    } else {
      Swal.fire('Cancelado', '', 'info');
    }
  });

}
//editar alguma linha
  function editar(botao, id){
    const linha=botao.closest('tr');
    const nomeAtual=linha.children[1].innerText;
    const emailAtual=linha.children[2].innerText;

    Swal.fire({
      title: 'Editar aluno',
      html:
       `<input id="swal-input1" class="swal2-input" placeholder="Nome" value="${nomeAtual}">` +
      `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${emailAtual}">`,
      focusConfirm:false,
      preConfirm:()=>{
        const nome= document.getElementById('swal-input1').value.trim();
        const email= document.getElementById('swal-input2').value.trim();
          if (!nome||!email) {
            swal.showValidationMessage("preencha todos os campos")
            return false;
          }
          return {nome,email};
      }
    })
    .then((result)=>{
      if(result.isConfirmed){
        const {nome,email}=result.value;

        fetch(`http://localhost:8080/alunos/${id}`,{
          method:'PUT',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({nome,email})
        })
        .then(res=>{
          if (!res.ok) throw new Error("Erro ao atualizar");
          return res.json();
        })
        .then(data=>{
          //atualiza com os novos dados
          linha.children[1].innerText-data.nome;
          linha.children[2].innerText-data.email;
          swal.fire('Atualizado!','','success');
        })
        .catch(err=>{
          console.error(err);
          Swal.fire('erro!','','nao foi possivel atualizar');
        });
      }
    });

  }