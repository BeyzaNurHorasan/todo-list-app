//İlk başta HTML sayfasındaki belirli öğeleri (formlar, butonlar, liste öğeleri) JavaScript'te kullanmak için seçiyoruz.
const form = document.querySelector("#todoAddForm");
// Bu kod satırı, HTML sayfasındaki id değeri "todoAddForm" olan elementi seçip,
// JavaScript'teki bir form değişkenine atıyor. Yani, document.querySelector ile sayfadaki 
// belirli bir elementi seçiyorsun ve bu form elementine 
// sonradan yapılacak işlemler için referans oluşturmuş oluyorsun.
// #todoAddForm id'sine sahip formu seçiyoruz. Bu form, yapılacaklar listesine yeni bir öğe eklemek için kullanılır.
const addInput = document.querySelector("#todoName");
//#todoName id'sine sahip olan girdi kutusunu seçiyoruz. Kullanıcı buraya bir yapılacak yazacak.
const todoList = document.querySelector(".list-group"); 
//.list-group sınıfına sahip listeyi seçiyoruz. Bu liste, yapılacaklar listesinin ekranda göründüğü yerdir.
const firstCardBody = document.querySelectorAll(".card-body")[0];
//.card-body sınıfına sahip ilk öğeyi seçiyoruz. Uyarı mesajları burada gösterilecek.
const secondCardBody = document.querySelectorAll(".card-body")[1];
//.card-body sınıfına sahip ikinci öğeyi seçiyoruz. Bu bölümdeki yapılacak öğelerine tıklayıp silme işlemi yapıyoruz.
const clearButton = document.querySelector("#clearButton");
//#clearButton id'sine sahip butonu seçiyoruz. Bu butona tıklayınca tüm yapılacaklar silinecek.
const filterInput = document.querySelector("#todoSearch");
//#todoSearch id'sine sahip arama kutusunu seçiyoruz. Kullanıcı buraya bir şey yazarsa, listedeki yapılacaklar bu kelimeye göre filtrelenecek.
// console.log(firstCardBody);
runEvents();
//Bu fonksiyon, tüm etkinlikleri (yani tıklama, form gönderme, arama kutusuna yazma gibi kullanıcı hareketlerini) dinlemeye başlar.
let todos = [];
//Bu dizi (array), yapılacaklar listesini hafızada tutmak için kullanılır.
function runEvents(){ //eventlerimizin yer aldığı fonksiyon
    console.log("Event dinleyici tanımlandı.");
        form.addEventListener("submit", addTodo);
        // Bu satır, form elementine bir submit (gönderme) olayı için dinleyici ekler.
        // Yani, kullanıcı formu gönderdiğinde (submit tuşuna bastığında ya da
        // Enter'a bastığında), belirttiğin addTodo fonksiyonu tetiklenecektir.
        document.addEventListener("DOMContentLoaded",pageLoaded);
        // ile sayfa yüklendiğinde yapılacaklar listesi yerel hafızadan (local storage) çekilir.
        //DOMContentLoaded etkinliği sayfanın tamamen yüklenip hazır olduğunu belirtir.

        secondCardBody.addEventListener("click", removeTodoToUI);
        //ile yapılacaklar listesindeki öğelere tıklayıp silme işlemi yapılır.

        clearButton.addEventListener("click", allTodosEverywhere);
        // ile tüm yapılacaklar silinir.

        filterInput.addEventListener("keyup",filter);
        //Kullanıcı filterInput alanına bir şey yazmaya başladığında (keyup), yani tuşa basıldığında, filter fonksiyonu çağrılır. 
        //Bu fonksiyon, yazılan değere göre yapılacaklar listesini filtreler (sadece ilgili olanlar görünür).
}           

//Sayfa Yüklendiğinde Verileri Alma
function pageLoaded(){
    checkTodosFromStorage();// yapılacakları hafızadan okuyup todos dizisine atar.
    todos.forEach(function(todo){//todos dizisinde yer alan her bir todo öğesi için bir döngü başlatır (forEach).
        addTodoToUI(todo);
    })//Bu fonksiyon, sayfa yüklendiğinde yerel hafızada (local storage) kayıtlı yapılacaklar listesini kontrol eder ve ekranda gösterir.
}

//Arama Yapma (Filtreleme)
function filter(e){//e etkinlik (event) objesidir. Bu, kullanıcı bir tuşa bastığında oluşur.
    const filterValue = e.target.value.toLowerCase().trim();//e.target.value ile arama kutusuna yazılan değeri alırız.
    const todoListesi = document.querySelectorAll(".list-group-item");//Sayfada gösterilen tüm yapılacakları (liste öğelerini) seçeriz.
    // .list-group-item her bir yapılacak (li) öğesine karşılık gelir.
    
    if(todoListesi.length>0){//Eğer yapılacaklar listesinde en az bir öğe varsa (liste boş değilse), bu koşul sağlanır ve aşağıdaki işlem yapılır.
        todoListesi.forEach(function(todo){//Listedeki her bir todo öğesi için döngü başlatılır.
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){
                //Her bir todo öğesinin metin içeriği (textContent) alınır, küçük harfe çevrilir, boşluklar temizlenir ve kullanıcının arama kutusuna yazdığı filterValue ile karşılaştırılır
                todo.setAttribute("style","display : block");//Eğer todo içeriği filterValue içeriyorsa, bu öğe görünür kalır
            }else{
                todo.setAttribute("style","display : none !important");//Eğer todo içeriği aranan kelimeyi içermiyorsa, bu öğe gizlenir
            }
        });

    }else{
        showAlert("warning","Filtreleme yapmak için en az bir todo olmalıdır!");
        //Eğer yapılacaklar listesi tamamen boşsa (todoListesi.length === 0), bir uyarı mesajı gösteririz (showAlert).
    }
//filter fonksiyonu, kullanıcının arama kutusuna yazdığı kelimeyi alır (filterValue) ve listedeki öğelerle karşılaştırır.
// Eğer öğe, bu kelimeyi içeriyorsa görünür kalır, yoksa gizlenir.
}

//Tüm Yapılacakları Silme
function allTodosEverywhere(){
    const todoListesi = document.querySelectorAll(".list-group-item");
    //Sayfadaki tüm yapılacakları (liste öğelerini) seçiyoruz
    if(todoListesi.length>0){//Eğer listede en az bir yapılacak öğesi varsa, bu koşul sağlanır.
        //ekrandan silme
        todoListesi.forEach(function(todo){
            todo.remove();//Listedeki her bir todo öğesini teker teker seçip, ekrandan kaldırırız
        });

        //Storage'dan silme
        todos=[];//Hafızadaki (RAM'deki) todos dizisini boşaltırız. Artık hiçbir yapılacak kalmadığını gösteririz.
        localStorage.setItem("todos", JSON.stringify(todos));
        //Boş olan todos dizisini, yerel hafızaya (localStorage) kaydederiz. Bu, tüm yapılacakların hafızadan da silinmesi anlamına gelir.
        showAlert("success","Başarılı bir şekilde silindi");
    }else{
        showAlert("warning","silmek için en az bir todo olmalıdır");
    }// listedeki tüm yapılacakları hem ekrandan hem de yerel hafızadan siler.
}

//Tek Bir Yapılacak Silme
//Bu fonksiyon, yapılacaklar listesindeki bir öğeye tıklanarak o öğenin silinmesini sağlar. 
//Hem ekrandan hem de yerel hafızadan silinir.
function removeTodoToUI(e){
   // console.log(e.target);
   if(e.target.className==="fa fa-remove"){
   //Eğer kullanıcının tıkladığı öğenin sınıf adı "fa fa-remove" ise (bu bir silme ikonu), aşağıdaki işlemler yapılır.
   // console.log("çarpıya basmıştır");
   //ekrandan silme
   const todo =e.target.parentElement.parentElement;
   //İkonun iki üstündeki öğe (li öğesi) yani yapılacak listesi öğesi seçilir. Bu todo öğesini temsil eder.
   todo.remove();
   //Storage'dan silme
   removeTodoToStorage(todo.textContent);
   showAlert("success","Todo başarıyla silindi.");
   }
}

//Yerel Hafızadan Silme
//listeden silinen yapılacakları yerel hafızadan da çıkarır.
function removeTodoToStorage(removeTodo){
    checkTodosFromStorage();
    //İlk olarak yerel hafızada (localStorage) yapılacakların olup olmadığını kontrol ederiz 
    //ve eğer varsa, bu yapılacakları todos dizisine atarız.
    todos.forEach(function(todo,index){
        //todos dizisinde yer alan her bir todo öğesini ve bu öğenin indeksini döngüyle kontrol ederiz.
        if(removeTodo===todo){//Eğer removeTodo (silinmek istenen öğe) ile şu anki todo eşitse, bu koşul sağlanır.
            todos.splice(index,1);//splice fonksiyonu, dizide belirtilen indeks numarasındaki öğeyi siler (1 öğe silinsin diye 1 yazılır).
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));//Güncellenen todos dizisini tekrar yerel hafızaya kaydederiz. Bu işlem, yapılan değişikliklerin kalıcı olmasını sağlar.
}


//Yeni Yapılacak Ekleme
function  addTodo(e){
    const inputText = addInput.value.trim();
    //Kullanıcının formdaki giriş kutusuna yazdığı değeri alırız. 
    //addInput.value ile girilen metni alır, 
    //trim() ile başındaki ve sonundaki gereksiz boşlukları temizleriz.
    if(inputText == null || inputText == ""){
        //alert("lütfen bir değer giriniz!");
        showAlert("warning","Lütfen Boş Bırakmayınız!");
    }else{
        addTodoToUI(inputText);//Eğer giriş boş değilse, önce yapılacaklar listesine ekranda (UI) gösterilir.
        //arayüz ekleme
        addTodoToStorage(inputText);//Ardından, bu yeni yapılacak yerel hafızaya (localStorage) kaydedilir.
        //storage ekleme
        showAlert("success","Todo Eklendi!");
    }
        
    console.log("Submit eventi çalisti.");
    e.preventDefault();//Form gönderildiğinde sayfanın yeniden yüklenmesini engeller. 
    //Çünkü normalde, bir form gönderildiğinde sayfa yenilenir ve veriler sunucuya gönderilir.
    //sayesinde formun varsayılan davranışı olan sayfa yenileme işlemi durdurulur.
    //Yani sayfa yeniden yüklenmez ve yaptığımız işlemler kesintisiz devam eder.
}

//Yapılacakları Ekrana Ekleme
//Bu fonksiyon, yeni eklenen yapılacakları ekranda göstermek için HTML yapısı oluşturur ve listeye ekler.
function addTodoToUI(newTodo){
/*
<li class="list-group-item d-flex justify-content-between">Todo 1
                            <a href="#" class="delete-item">
                                <i class="fa fa-remove"></i>
                            </a>
                        </li>
                        */

    const li = document.createElement("li");
    //Yeni bir li (liste öğesi) oluştururuz. Bu li, yapılacaklar listesine eklenen her bir öğeyi temsil eder.

    li.className="list-group-item d-flex justify-content-between";
    //Bu satırda, li öğesine bazı CSS sınıfları ekleriz. list-group-item bu öğenin Bootstrap sınıfı olması,
    // d-flex justify-content-between ise bu öğeyi esnek (flexbox) ve içeriği iki yana yayılmış olarak düzenlemek için eklenir.
    
    li.textContent=newTodo;//Bu liste öğesinin içeriği (metin olarak) yeni eklenen yapılacak öğesinin (newTodo) kendisi olur.

    const a= document.createElement("a");//Bir a (link) öğesi oluştururuz. Bu, her yapılacak öğesinin yanındaki silme butonunun çevresindeki linktir.
    a.href="#";//Bu linke basıldığında sayfanın yukarıya kaymasını önlemek için boş bir link
    a.className="delete-item";// bu sınıf daha sonra silme işlemi yapılırken kullanılır.
    
    const i=document.createElement("i");//Silme butonu ikonu (i öğesi) oluşturulur.
    i.className="fa fa-remove";//Silme ikonu olarak bir çarpı işareti (remove) seçiyoruz. Bu Font Awesome kütüphanesinden gelir.

    a.appendChild(i);//İkonu link (a) öğesinin içine ekliyoruz.

    li.appendChild(a);//Silme linkini, yapılan liste öğesine (li) ekliyoruz.

    todoList.appendChild(li);//Son olarak bu yeni li öğesini yapılacaklar listesinin (todoList) sonuna ekliyoruz.

    addInput.value = "";//Formdaki giriş kutusunu temizliyoruz. Böylece kullanıcı yeni bir yapılacak eklerken eski metin silinmiş olur.
}

//Yapılacakları Yerel Hafızaya Ekleme
//Yeni bir yapılacak eklendiğinde bunu yerel hafızaya (local storage) kaydeder.
function addTodoToStorage(newTodo){
   checkTodosFromStorage();//İlk olarak yerel hafızadaki todos dizisini kontrol ederiz ve eğer varsa, bu diziyi getiririz.
   todos.push(newTodo);//todos dizisine yeni eklenen yapılacak (newTodo) öğesini ekleriz. Artık bu yapılacak, dizide de saklanır.
   localStorage.setItem("todos",JSON.stringify(todos));//Güncellenen todos dizisini JSON formatında yerel hafızaya (localStorage) kaydederiz. Bu, tarayıcıyı kapatsanız bile yapılacakların kaybolmamasını sağlar.
}

//Yerel Hafızayı Kontrol Etme
function checkTodosFromStorage(){
    if(localStorage.getItem("todos")===null){//Eğer yerel hafızada todos adında bir veri yoksa, bu yapılacaklar dizisi daha önce hiç kaydedilmemiş demektir.
        todos =[];//Eğer todos dizisi yoksa, boş bir dizi oluştururuz. Böylece yeni yapılacaklar eklenmeye hazır olur.
    }
    else{
        todos=JSON.parse(localStorage.getItem("todos"));
    }//yerel hafızada yapılacakların olup olmadığını kontrol eder ve eğer varsa,bunları geri getirir
}

//Uyarı Mesajları Gösterme
function showAlert(type,message){
    // <div class="alert alert-warning" role="alert">
    //                     This is a warning alert—check it out!
    //                   </div>
    const div =document.createElement("div");//Yeni bir div öğesi oluştururuz. Bu, ekranda gösterilecek olan uyarı mesajını temsil eder.
    //div.className="alert alert-"+type;
    div.className=`alert alert-${type}`;//Template literals
    //div öğesine CSS sınıfları ekleriz. alert alert-${type} Bootstrap'in uyarı sınıflarını kullanır. type parametresi (örneğin "success", "warning") ile hangi tür uyarı olduğunu belirleriz.
    div.textContent = message;//Uyarı mesajının içeriği, message parametresi ile belirlenir. Bu mesaj kullanıcıya gösterilecektir.
    firstCardBody.appendChild(div);//Bu uyarı mesajı (div) sayfadaki firstCardBody öğesinin sonuna eklenir, yani kullanıcı mesajı ekranda görür.
    setTimeout(function(){
        div.remove();
    },2500);//2.5 saniye sonra bu uyarı mesajını ekrandan kaldırırız 
}
