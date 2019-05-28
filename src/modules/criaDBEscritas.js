reaj = require('./analisaRearranjo')

//converte em hexa
function binarificar(nr,t){
    let conv
    //let str = nr.toString(2) //Binário
    let str = parseInt(nr).toString(16) //Hexadecimal ///modificado
    if(t === 'b' ){conv = '00'.slice(str.length) + str}
    if(t === 'w' ){conv = '0000'.slice(str.length) + str}
    return conv
}
function escreveDBEscritas(rede){    
    //linhas no formato do data block original
    let declaracoes = ''
    let inicializacoes  = '' 
    let a='',b='',c='',d =''
    let i = 1
    rede.forEach(function(rele){        
    a +=`
    ENDSL_FCH_CP${i} : BYTE  := B#16#${binarificar(parseInt(rele.endereco),'b')};	//Endereço do Slave acessado #${i}
    FC_FCH_CP${i} : BYTE  := B#16#6;	//Function Code para execução
    REG_FCH_CP${i} : WORD  := W#16#${binarificar(parseInt(rele.registradores[1].split('.')[0]),'w')};	//Endereço para escrita   
    VAL_FCH_CP${i} : WORD  := W#16#${binarificar(Math.pow(2,parseInt(rele.registradores[1].split('.')[1])),'w')};	//Word para escrita   
    ` 
    b +=`
    ENDSL_ABR_CP${i} : BYTE  := B#16#${binarificar(parseInt(rele.endereco),'b')};	//Endereço do Slave acessado #${i}
    FC_ABR_CP${i} : BYTE  := B#16#6;    //Function Code para execução
    REG_ABR_CP${i} : WORD  := W#16#${binarificar(parseInt(rele.registradores[0].split('.')[0]),'w')};	//Endereço para escrita   
    VAL_ABR_CP${i} : WORD  := W#16#${binarificar(Math.pow(2,parseInt(rele.registradores[0].split('.')[1])),'w')};	//Word para escrita   
    `
    //console.log(Math.pow(2,parseInt(rele.registradores[0].split('.')[1]))) 
    c +=`
    ENDSL_FCH_CP${i} := B#16#${binarificar(parseInt(rele.endereco),'b')};	//Endereço do Slave acessado #${i}
    FC_FCH_CP${i}    := B#16#6;	//Function Code para execução
    REG_FCH_CP${i}   := W#16#${binarificar(parseInt(rele.registradores[1].split('.')[0]),'w')};	//Endereço para escrita   
    VAL_FCH_CP${i}   := W#16#${binarificar(Math.pow(2,parseInt(rele.registradores[1].split('.')[1])),'w')};	//Word para escrita      
    `
    d +=`
    ENDSL_ABR_CP${i} := B#16#${binarificar(parseInt(rele.endereco),'b')};	//Endereço do Slave acessado #${i}
    FC_ABR_CP${i}    := B#16#6;    //Function Code para execução
    REG_ABR_CP${i}   := W#16#${binarificar(parseInt(rele.registradores[0].split('.')[0]),'w')};	//Endereço para escrita   
    VAL_ABR_CP${i}   := W#16#${binarificar(Math.pow(2,parseInt(rele.registradores[0].split('.')[1])),'w')};	//Word para escrita   
    `    
    i++
    })

    for (i= rede.length+1;i<21;i++){
    a +=`
    ENDSL_FCH_CP${i} : BYTE  := B#16#00;	//Endereço do Slave acessado spare #${i}
    FC_FCH_CP${i} : BYTE  := B#16#6;	//Function Code para execução
    REG_FCH_CP${i} : WORD  := W#16#0000;	//Endereço para escrita   
    VAL_FCH_CP${i} : WORD  := W#16#0000;	//Word para escrita   
    ` 
    b +=`
    ENDSL_ABR_CP${i} : BYTE  := B#16#00;	//Endereço do Slave acessado spare #${i}
    FC_ABR_CP${i} : BYTE  := B#16#6;    //Function Code para execução
    REG_ABR_CP${i} : WORD  := W#16#0000;	//Endereço para escrita   
    VAL_ABR_CP${i} : WORD  := W#16#0000;	//Word para escrita   
    ` 
    c +=`
    ENDSL_FCH_CP${i} := B#16#00;	//Endereço do Slave acessado spare #${i}
    FC_FCH_CP${i}    := B#16#6;	//Function Code para execução
    REG_FCH_CP${i}   := W#16#0000;	//Endereço para escrita   
    VAL_FCH_CP${i}   := W#16#0000;	//Word para escrita      
    `
    d +=`
    ENDSL_ABR_CP${i} := B#16#00;	//Endereço do Slave acessado spare#${i}
    FC_ABR_CP${i}    := B#16#6;    //Function Code para execução
    REG_ABR_CP${i}   := W#16#0000;	//Endereço para escrita   
    VAL_ABR_CP${i}   := W#16#0000;	//Word para escrita   
    `
    }

    declaracoes += a; //+ b;
    declaracoes += b;
    inicializacoes += c;// + d;
    inicializacoes += d;
    //Retorna objeto JS com nova DB 
    let dbLeituras = { declaracoes: declaracoes, inicializacoes: inicializacoes,}
    return dbLeituras
}
//
exports.setDBEscritas = function setDBEscritas(rede,numDB){
let linhas = {}
linhas = escreveDBEscritas(rede)
let db =`
DATA_BLOCK DB ${numDB}
TITLE =DADOS PARA ESCRITA NOS RELES
AUTHOR : U4LW
FAMILY : MULTILIN
NAME : SND_FC
VERSION : 2.0
READ_ONLY
  STRUCT
  ${linhas.declaracoes}   	  
  END_STRUCT ;	
BEGIN
  ${linhas.inicializacoes}   
END_DATA_BLOCK`
return db
}