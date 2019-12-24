import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AppService {
    constructor() { }

    private users = [
        {
          "_id": "5aaa0d8de72edc57a2ffa2a0",
          "index": 0,
          "guid": "5c4df3d6-88cc-4833-8577-cbcba31e5b72",
          "isActive": false,
          "balance": "$2,866.70",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 39,
          "eyeColor": "blue",
          "name": "Mathis Morales",
          "gender": "male",
          "company": "EURON",
          "email": "mathismorales@euron.com",
          "phone": "+1 (940) 531-2138",
          "address": {
            "street": "490 Imlay Street",
            "suite": "Apt. 556",
            "city": "Wyoming",
            "zipcode": "92998-3874"
          },
          "about": "Ad reprehenderit ullamco nulla magna tempor sit non ex tempor ut amet sint ipsum mollit. Veniam eiusmod duis velit do nostrud sit laborum non ex non qui ea tempor. Magna incididunt culpa irure eiusmod in ullamco ullamco ullamco Lorem. Excepteur in irure officia esse aliqua est sint pariatur. Velit esse eiusmod eiusmod duis commodo laboris.\r\n",
          "registered": "2016-03-10T01:01:20Z",
          "latitude": 46.916452,
          "longitude": -120.734994,
          "tags": [
            "incididunt",
            "laborum",
            "in",
            "sit",
            "mollit",
            "culpa",
            "ipsum"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Duncan Stevens"
            },
            {
              "id": 1,
              "name": "Bonita Albert"
            },
            {
              "id": 2,
              "name": "Taylor Stone"
            }
          ],
          "greeting": "Hello, Mathis Morales! You have 7 unread messages.",
          "favoriteFruit": "strawberry"
        },
        {
          "_id": "5aaa0d8d3530dbc3b36190ea",
          "index": 1,
          "guid": "b3682f9a-8a81-474e-88a7-5c9be2a1cc8d",
          "isActive": false,
          "balance": "$2,070.14",
          "picture": "https://image.flaticon.com/icons/png/128/701/701997.png",
          "age": 134,
          "eyeColor": "green",
          "name": "Tonya Sweeney",
          "gender": "female",
          "company": "FIREWAX",
          "email": "tonyasweeney@firewax.com",
          "phone": "+1 (928) 563-2254",
          "address": {
            "street": "288 Shale Street",
            "suite": "Apt. 556",
            "city": "Wyoming",
            "zipcode": "92998-7398"
          },
          "about": "Lorem est duis adipisicing sit pariatur esse minim aliquip id est velit non cillum laborum. Dolor enim sit est ea elit non culpa laboris consectetur et id veniam laboris. Id sint qui ut occaecat laboris cillum dolor commodo pariatur velit qui. Irure est qui ullamco ipsum veniam ipsum voluptate Lorem fugiat ipsum cupidatat veniam commodo et. Id exercitation enim exercitation tempor adipisicing tempor veniam adipisicing nostrud qui.\r\n",
          "registered": "2015-04-11T01:01:20Z",
          "latitude": -65.434795,
          "longitude": -108.165752,
          "tags": [
            "est",
            "ad",
            "proident",
            "occaecat",
            "dolor",
            "aute",
            "exercitation"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Cannon Wagner"
            },
            {
              "id": 1,
              "name": "Horne Holt"
            },
            {
              "id": 2,
              "name": "Carol Dillon"
            }
          ],
          "greeting": "Hello, Tonya Sweeney! You have 8 unread messages.",
          "favoriteFruit": "apple"
        },
        {
          "_id": "5aaa0d8deaa6c896d7a191f4",
          "index": 2,
          "guid": "6d8b932f-36a3-4f0c-8f48-b20cb23c8a53",
          "isActive": false,
          "balance": "$1,883.90",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 121,
          "eyeColor": "blue",
          "name": "Nguyen Hubbard",
          "gender": "male",
          "company": "HOMELUX",
          "email": "nguyenhubbard@homelux.com",
          "phone": "+1 (826) 465-3417",
          "address": {
            "street": "271 Barwell Terrace",
            "suite": "Apt. 556",
            "city": "Seymour",
            "zipcode": "92998-3641"
          },
          "about": "Velit id proident pariatur reprehenderit et officia Lorem in qui minim voluptate officia. Anim adipisicing mollit officia qui exercitation deserunt deserunt in. Est incididunt mollit do et eu ex eiusmod sunt quis aute. Aliqua ipsum dolore reprehenderit occaecat aute ea culpa qui consequat eu veniam id.\r\n",
          "registered": "2014-03-10T01:01:20Z",
          "latitude": -68.421096,
          "longitude": 153.822867,
          "tags": [
            "mollit",
            "ea",
            "cupidatat",
            "quis",
            "pariatur",
            "proident",
            "cillum"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Watson Floyd"
            },
            {
              "id": 1,
              "name": "Mary Cotton"
            },
            {
              "id": 2,
              "name": "Dixie Mullins"
            }
          ],
          "greeting": "Hello, Nguyen Hubbard! You have 1 unread messages.",
          "favoriteFruit": "banana"
        },
        {
          "_id": "5aaa0d8d8907a727fe9909f6",
          "index": 3,
          "guid": "701134c1-82cd-4f24-a867-f896350643f9",
          "isActive": false,
          "balance": "$3,666.56",
          "picture": "https://image.flaticon.com/icons/png/128/701/701997.png",
          "age": 37,
          "eyeColor": "brown",
          "name": "Cecelia Hartman",
          "gender": "female",
          "company": "MOMENTIA",
          "email": "ceceliahartman@momentia.com",
          "phone": "+1 (937) 578-2156",
          "address": {
            "street": "548 Clymer Street",
            "suite": "Apt. 556",
            "city": "Loveland",
            "zipcode": "92998-3641"
          },
          "about": "Est voluptate ea occaecat officia excepteur do ut magna pariatur voluptate ullamco. Ad enim proident officia aliquip incididunt. Culpa tempor laborum adipisicing minim nisi Lorem duis culpa officia reprehenderit nostrud cupidatat elit commodo. Nostrud ea exercitation aliquip nisi id. Aute ullamco consectetur veniam ex ad id nisi nisi fugiat Lorem dolor sit consequat in. Magna aliquip minim ullamco consectetur ex duis dolore deserunt anim ipsum. Ipsum aliquip irure incididunt deserunt sint voluptate ea voluptate voluptate nulla pariatur pariatur.\r\n",
          "registered": "2016-06-16T01:01:20Z",
          "latitude": -56.348654,
          "longitude": 52.767967,
          "tags": [
            "est",
            "id",
            "ut",
            "sint",
            "cillum",
            "minim",
            "commodo"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Yang Barrera"
            },
            {
              "id": 1,
              "name": "Rosella Lane"
            },
            {
              "id": 2,
              "name": "Doyle Welch"
            }
          ],
          "greeting": "Hello, Cecelia Hartman! You have 5 unread messages.",
          "favoriteFruit": "banana"
        },
        {
          "_id": "5aaa0d8dce9b34329be37614",
          "index": 4,
          "guid": "09af711e-26e4-4169-8e09-99bb7ef8d149",
          "isActive": true,
          "balance": "$2,665.18",
          "picture": "https://image.flaticon.com/icons/png/128/701/701997.png",
          "age": 28,
          "eyeColor": "green",
          "name": "Gilliam Walker",
          "gender": "male",
          "company": "AQUASSEUR",
          "email": "gilliamwalker@aquasseur.com",
          "phone": "+1 (909) 586-3974",
          "address": {
            "street": "811 Bond Street",
            "suite": "Apt. 556",
            "city": "Marienthal",
            "zipcode": "92998-5512"
          },
          "about": "Ex laboris dolor ut voluptate commodo consequat ad id et. Do magna do pariatur minim magna deserunt velit culpa cupidatat Lorem. Ea sunt nostrud cupidatat qui consectetur mollit ex dolor labore. Magna nostrud deserunt culpa voluptate est tempor duis esse ea ea. Do laborum do commodo amet sunt officia officia nulla consequat labore deserunt.\r\n",
          "registered": "2014-01-17T01:01:20Z",
          "latitude": -8.285576,
          "longitude": 65.712943,
          "tags": [
            "sint",
            "sit",
            "fugiat",
            "excepteur",
            "nulla",
            "velit",
            "velit"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Margret Spence"
            },
            {
              "id": 1,
              "name": "Stacie Mann"
            },
            {
              "id": 2,
              "name": "Meyers Hansen"
            }
          ],
          "greeting": "Hello, Gilliam Walker! You have 8 unread messages.",
          "favoriteFruit": "strawberry"
        },
        {
          "_id": "5aaa0d8d276289980c471c92",
          "index": 5,
          "guid": "36913bf3-9b05-41ab-a274-d033866adf92",
          "isActive": true,
          "balance": "$3,698.24",
          "picture": "https://image.flaticon.com/icons/png/128/701/701997.png",
          "age": 319,
          "eyeColor": "brown",
          "name": "Bernard Downs",
          "gender": "male",
          "company": "PROSURE",
          "email": "bernarddowns@prosure.com",
          "phone": "+1 (850) 400-3183",
          "address": {
            "street": "351 Orange Street",
            "suite": "Apt. 556",
            "city": "Machias",
            "zipcode": "92998-5241"
          },
          "about": "Laborum ipsum nulla aute quis ad do qui id ex sint sit. Duis Lorem ea mollit dolor ipsum cupidatat ipsum elit veniam cupidatat eu culpa tempor est. Irure aute veniam laboris velit Lorem et do incididunt. Magna sunt ipsum pariatur commodo id ad sit ipsum aliqua proident aute culpa velit elit.\r\n",
          "registered": "2017-03-10T01:01:20Z",
          "latitude": -50.21133,
          "longitude": -165.969327,
          "tags": [
            "duis",
            "laboris",
            "dolor",
            "adipisicing",
            "mollit",
            "enim",
            "mollit"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Hanson Henry"
            },
            {
              "id": 1,
              "name": "Beulah Hodge"
            },
            {
              "id": 2,
              "name": "Fay Trevino"
            }
          ],
          "greeting": "Hello, Bernard Downs! You have 4 unread messages.",
          "favoriteFruit": "banana"
        },
        {
          "_id": "5aaa0d8d4bbab672fea889bc",
          "index": 6,
          "guid": "a3ca7ac4-c798-40e4-acfa-e4a942c56efb",
          "isActive": false,
          "balance": "$2,351.14",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 28,
          "eyeColor": "brown",
          "name": "Cooke Sellers",
          "gender": "male",
          "company": "RETROTEX",
          "email": "cookesellers@retrotex.com",
          "phone": "+1 (837) 495-3455",
          "address": {
            "street": "375 Fountain Avenue",
            "suite": "Apt. 556",
            "city": "Forestburg",
            "zipcode": "92998-5996"
          },
          "about": "Est dolore Lorem anim quis proident. Magna sint ea proident laboris quis do reprehenderit laborum fugiat dolor cupidatat mollit veniam. Et id incididunt mollit ipsum sint aute. Velit sunt ea ullamco pariatur consequat cupidatat consequat. Non velit nostrud reprehenderit deserunt incididunt commodo.\r\n",
          "registered": "2018-01-10T01:01:20Z",
          "latitude": -62.206696,
          "longitude": -130.603082,
          "tags": [
            "eiusmod",
            "proident",
            "sit",
            "nulla",
            "qui",
            "ipsum",
            "elit"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Payne Jimenez"
            },
            {
              "id": 1,
              "name": "Long Reilly"
            },
            {
              "id": 2,
              "name": "Nellie Richmond"
            }
          ],
          "greeting": "Hello, Cooke Sellers! You have 1 unread messages.",
          "favoriteFruit": "banana"
        },
        {
          "_id": "5aaa0d8d8bd2919a9de7fdae",
          "index": 7,
          "guid": "170dfa05-141f-4e7b-a462-f4a55b21d3d7",
          "isActive": true,
          "balance": "$3,562.47",
          "picture": "https://image.flaticon.com/icons/png/128/701/701997.png",
          "age": 32,
          "eyeColor": "blue",
          "name": "Lawrence Barnett",
          "gender": "male",
          "company": "OBLIQ",
          "email": "lawrencebarnett@obliq.com",
          "phone": "+1 (939) 507-3595",
          "address": {
            "street": "271 Lincoln Road",
            "suite": "Apt. 556",
            "city": "Cumberland",
            "zipcode": "92998-1969"
          },
          "about": "Consectetur ad minim fugiat sunt exercitation officia occaecat ut id. Eu dolor occaecat sint ad excepteur culpa pariatur voluptate do nisi duis tempor aliquip. Labore nisi excepteur Lorem veniam est adipisicing commodo ex culpa non sint. Sit voluptate enim nostrud esse irure sunt est ea ut velit laboris anim aliquip. Sunt sint nulla deserunt labore minim dolore anim culpa laboris est qui id. Amet magna pariatur et irure sunt reprehenderit id.\r\n",
          "registered": "2011-04-20T01:01:20Z",
          "latitude": 47.207648,
          "longitude": 17.595186,
          "tags": [
            "mollit",
            "ullamco",
            "adipisicing",
            "enim",
            "cillum",
            "aliqua",
            "reprehenderit"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Castillo Parsons"
            },
            {
              "id": 1,
              "name": "Spence Steele"
            },
            {
              "id": 2,
              "name": "Nona Burnett"
            }
          ],
          "greeting": "Hello, Lawrence Barnett! You have 6 unread messages.",
          "favoriteFruit": "apple"
        },
        {
          "_id": "5aaa0d8d27ab2e871522318f",
          "index": 8,
          "guid": "e09ece86-d227-4c47-91ab-49481a6c6fa0",
          "isActive": false,
          "balance": "$3,756.37",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 36,
          "eyeColor": "brown",
          "name": "Jaime Woodard",
          "gender": "female",
          "company": "AUSTECH",
          "email": "jaimewoodard@austech.com",
          "phone": "+1 (986) 449-2054",
          "address": {
            "street": "271 Lincoln Road",
            "suite": "Apt. 556",
            "city": "Cumberland",
            "zipcode": "92998-1969"
          },
          "about": "Culpa est nostrud non anim qui exercitation ullamco magna anim fugiat consectetur Lorem sunt qui. Minim non reprehenderit eu sunt sunt enim fugiat laboris id adipisicing. Do minim labore sunt laborum duis in sint occaecat exercitation dolore aliquip elit irure eu. Adipisicing velit ea et veniam proident et pariatur. Ad sunt enim aliqua eu sint duis commodo.\r\n",
          "registered": "2017-05-10T01:01:20Z",
          "latitude": -71.476505,
          "longitude": 14.61685,
          "tags": [
            "velit",
            "deserunt",
            "proident",
            "non",
            "deserunt",
            "voluptate",
            "laboris"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Alexandria Shaw"
            },
            {
              "id": 1,
              "name": "Leach Rhodes"
            },
            {
              "id": 2,
              "name": "Lisa Dorsey"
            }
          ],
          "greeting": "Hello, Jaime Woodard! You have 6 unread messages.",
          "favoriteFruit": "strawberry"
        },
        {
          "_id": "5aaa0d8da1df0afbe903ae1b",
          "index": 9,
          "guid": "36c27f54-bc3a-4280-903f-a79c9503a8e2",
          "isActive": true,
          "balance": "$2,819.61",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 28,
          "eyeColor": "blue",
          "name": "Wilcox Becker",
          "gender": "male",
          "company": "GONKLE",
          "email": "wilcoxbecker@gonkle.com",
          "phone": "+1 (922) 506-2399",
          "address": {
            "street": "271 Lincoln Road",
            "suite": "Apt. 556",
            "city": "Cumberland",
            "zipcode": "92998-1969"
          },
          "about": "Adipisicing deserunt excepteur nostrud non incididunt nulla adipisicing velit incididunt incididunt elit culpa exercitation. Commodo Lorem eiusmod laborum amet Lorem proident incididunt dolor aliqua incididunt eu. Non amet proident minim elit sit Lorem voluptate cupidatat aute. Labore esse ipsum mollit eu quis enim labore aute. Excepteur reprehenderit exercitation esse aliquip. Elit velit dolore amet sunt.\r\n",
          "registered": "2018-02-11T01:01:20Z",
          "latitude": -26.572511,
          "longitude": 169.488811,
          "tags": [
            "et",
            "velit",
            "do",
            "reprehenderit",
            "labore",
            "laborum",
            "laboris"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Branch Patel"
            },
            {
              "id": 1,
              "name": "Imogene Palmer"
            },
            {
              "id": 2,
              "name": "Mckenzie Mcconnell"
            }
          ],
          "greeting": "Hello, Wilcox Becker! You have 2 unread messages.",
          "favoriteFruit": "apple"
        },
        {
          "_id": "5aaa0d8de92a65a8eff0692b",
          "index": 10,
          "guid": "1064823b-bb77-4945-8bce-b37e085c6ce8",
          "isActive": false,
          "balance": "$3,981.63",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 30,
          "eyeColor": "brown",
          "name": "Concepcion Mcpherson",
          "gender": "female",
          "company": "WAAB",
          "email": "concepcionmcpherson@waab.com",
          "phone": "+1 (916) 529-2785",
          "address": {
            "street": "288 Shale Street",
            "suite": "Apt. 556",
            "city": "Wyoming",
            "zipcode": "92998-7398"
          },
          "about": "Quis aliquip veniam velit duis. Eiusmod id amet laborum do tempor tempor. Cupidatat consequat culpa cupidatat nisi dolor non duis nisi sint occaecat laboris. Magna eu amet aliquip occaecat qui. Enim laborum veniam pariatur incididunt in fugiat proident enim fugiat.\r\n",
          "registered": "2011-05-01T01:01:20Z",
          "latitude": -6.967468,
          "longitude": -48.045961,
          "tags": [
            "eu",
            "anim",
            "est",
            "tempor",
            "proident",
            "sunt",
            "voluptate"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Patti Mckay"
            },
            {
              "id": 1,
              "name": "Carlene Barry"
            },
            {
              "id": 2,
              "name": "Black Bruce"
            }
          ],
          "greeting": "Hello, Concepcion Mcpherson! You have 8 unread messages.",
          "favoriteFruit": "apple"
        },
        {
          "_id": "5aaa0d8ddd09ce4ca3fb8182",
          "index": 11,
          "guid": "4c9bd812-dd98-4dfa-8751-3bc696a3f54b",
          "isActive": false,
          "balance": "$3,524.69",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 31,
          "eyeColor": "brown",
          "name": "Maxine Bridges",
          "gender": "female",
          "company": "KNOWLYSIS",
          "email": "maxinebridges@knowlysis.com",
          "phone": "+1 (955) 445-3426",
          "address": {
            "street": "886 McKibbin Street",
            "suite": "Apt. 556",
            "city": "WBuxtonyoming",
            "zipcode": "92998-9280"
          },
          "about": "Eu irure do ad aliquip mollit ullamco esse adipisicing commodo. Sit aliquip reprehenderit pariatur commodo aliqua incididunt consequat aliqua occaecat dolor ipsum anim mollit. Ipsum ad qui minim ex qui nostrud eu ad id nulla mollit consequat fugiat reprehenderit. Dolore ea culpa qui occaecat quis ad. Quis minim mollit mollit do sunt officia. Cupidatat commodo in esse laborum cillum veniam ad esse incididunt. Mollit incididunt culpa sunt aute do.\r\n",
          "registered": "2016-06-10T01:01:20Z",
          "latitude": -87.070432,
          "longitude": 72.863521,
          "tags": [
            "ea",
            "Lorem",
            "culpa",
            "aliqua",
            "irure",
            "reprehenderit",
            "non"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Maritza Harris"
            },
            {
              "id": 1,
              "name": "Jenkins Tanner"
            },
            {
              "id": 2,
              "name": "Carey Barton"
            }
          ],
          "greeting": "Hello, Maxine Bridges! You have 2 unread messages.",
          "favoriteFruit": "apple"
        },
        {
          "_id": "5aaa0d8d7a7a8292d0def9ff",
          "index": 12,
          "guid": "2a72dbbd-e543-400f-894d-8b63172517a9",
          "isActive": false,
          "balance": "$2,089.46",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 34,
          "eyeColor": "green",
          "name": "Craig Gibson",
          "gender": "male",
          "company": "UNCORP",
          "email": "craiggibson@uncorp.com",
          "phone": "+1 (829) 513-2318",
          "address": {
            "street": "455 Lincoln Avenue",
            "suite": "Apt. 556",
            "city": "Iberia",
            "zipcode": "92998-7860"
          },
          "about": "Sunt aute esse dolore ea adipisicing dolor et amet commodo culpa fugiat cillum occaecat nisi. Eu officia eiusmod et sint veniam tempor irure labore ipsum sit. Esse velit minim voluptate sunt esse exercitation exercitation adipisicing. Cupidatat commodo pariatur tempor aliqua enim eu aliqua.\r\n",
          "registered": "2011-01-18T01:01:20Z",
          "latitude": 10.450444,
          "longitude": 169.33071,
          "tags": [
            "ex",
            "ut",
            "sit",
            "qui",
            "elit",
            "veniam",
            "reprehenderit"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Neal Gaines"
            },
            {
              "id": 1,
              "name": "Robbins Sandoval"
            },
            {
              "id": 2,
              "name": "Aisha Knight"
            }
          ],
          "greeting": "Hello, Craig Gibson! You have 9 unread messages.",
          "favoriteFruit": "banana"
        },
        {
          "_id": "5aaa0d8dd9302d80f18c1e10",
          "index": 13,
          "guid": "5f1bddac-19a6-47fa-ba25-6b38b87c8f50",
          "isActive": false,
          "balance": "$1,000.51",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 20,
          "eyeColor": "blue",
          "name": "Gould Holmes",
          "gender": "male",
          "company": "BALUBA",
          "email": "gouldholmes@baluba.com",
          "phone": "+1 (860) 452-2739",
          "address": {
            "street": "455 Lincoln Avenue",
            "suite": "Apt. 556",
            "city": "Iberia",
            "zipcode": "92998-7860"
          },
          "about": "Esse tempor ea magna irure. Lorem ullamco aliquip labore qui et quis culpa nostrud. Ex aliqua culpa culpa fugiat mollit id eiusmod. Velit ut nisi laboris non magna amet ipsum non irure. Nostrud nostrud sint consequat pariatur labore occaecat aute nulla adipisicing aliqua ut. Sint irure quis dolore ipsum quis nisi. Id velit aliqua officia elit aliquip mollit nulla eiusmod aute eu do laborum.\r\n",
          "registered": "2018-02-10T01:01:20Z",
          "latitude": 17.539471,
          "longitude": 71.124751,
          "tags": [
            "voluptate",
            "id",
            "ex",
            "elit",
            "esse",
            "quis",
            "quis"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Florine Zamora"
            },
            {
              "id": 1,
              "name": "Terrell Daniel"
            },
            {
              "id": 2,
              "name": "Meredith Phelps"
            }
          ],
          "greeting": "Hello, Gould Holmes! You have 4 unread messages.",
          "favoriteFruit": "strawberry"
        },
        {
          "_id": "5aaa0d8d1995a9d1cb81de78",
          "index": 14,
          "guid": "929950e8-1b7e-49fd-9166-a22e1b013eae",
          "isActive": false,
          "balance": "$3,977.01",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 40,
          "eyeColor": "green",
          "name": "Downs Kent",
          "gender": "male",
          "company": "ANDERSHUN",
          "email": "downskent@andershun.com",
          "phone": "+1 (917) 525-3943",
          "address": {
            "street": "455 Lincoln Avenue",
            "suite": "Apt. 556",
            "city": "Iberia",
            "zipcode": "92998-7860"
          },
          "about": "Aute ipsum reprehenderit elit occaecat qui culpa aute nisi tempor reprehenderit eiusmod culpa Lorem ullamco. Deserunt excepteur laborum ullamco tempor qui nostrud esse excepteur. Minim reprehenderit veniam aliqua enim laboris. Elit magna mollit fugiat laboris fugiat nulla deserunt dolor duis. Sit dolor incididunt adipisicing deserunt eu veniam sunt elit occaecat ea.\r\n",
          "registered": "2013-03-18T01:01:20Z",
          "latitude": -27.25604,
          "longitude": -43.099059,
          "tags": [
            "irure",
            "velit",
            "est",
            "officia",
            "culpa",
            "voluptate",
            "do"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Araceli Buckner"
            },
            {
              "id": 1,
              "name": "Cruz Estes"
            },
            {
              "id": 2,
              "name": "Jarvis Cooper"
            }
          ],
          "greeting": "Hello, Downs Kent! You have 3 unread messages.",
          "favoriteFruit": "strawberry"
        },
        {
          "_id": "5aaa0d8d405ccbedbddc2908",
          "index": 15,
          "guid": "5f8316b5-bb86-4323-a1c9-fd0ef87b0550",
          "isActive": false,
          "balance": "$2,852.33",
          "picture": "https://image.flaticon.com/icons/png/128/145/145862.png",
          "age": 31,
          "eyeColor": "blue",
          "name": "Ramos England",
          "gender": "male",
          "company": "BIOSPAN",
          "email": "ramosengland@biospan.com",
          "phone": "+1 (883) 524-3172",
          "address": {
            "street": "105 Taaffe Place",
            "suite": "Apt. 556",
            "city": "Wollochet",
            "zipcode": "92998-5679"
          },
          "about": "Occaecat officia eu qui quis dolor magna et occaecat amet proident Lorem ut tempor. Aliqua magna ea reprehenderit laborum pariatur pariatur magna aute in. Aute aliquip duis adipisicing mollit in officia adipisicing labore. Labore amet in dolor elit tempor et aliquip Lorem reprehenderit. Cillum incididunt dolore irure fugiat pariatur laborum culpa. Laboris voluptate tempor dolor aute nulla dolor proident consequat nisi. Ad ad id dolore cupidatat aliqua aliqua occaecat.\r\n",
          "registered": "2003-03-10T01:01:20Z",
          "latitude": 22.545507,
          "longitude": -131.560084,
          "tags": [
            "ut",
            "nisi",
            "adipisicing",
            "sit",
            "esse",
            "nostrud",
            "minim"
          ],
          "friends": [
            {
              "id": 0,
              "name": "Ball Campbell"
            },
            {
              "id": 1,
              "name": "Baker Carney"
            },
            {
              "id": 2,
              "name": "Powers Pitts"
            }
          ],
          "greeting": "Hello, Ramos England! You have 5 unread messages.",
          "favoriteFruit": "apple"
        }
      ];

    usersList() {
        // return this.http.get('https://jsonplaceholder.typicode.com/users/');
        return new BehaviorSubject(this.users);
    }
}
