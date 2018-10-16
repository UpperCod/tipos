# Tipos

Esta pequeña librería permite crear mapas de tipos para **filtrar** o **sanear** entradas objeto.

### Ejemplo

```js
import types from "tipos";

let user = types({
   id : "type('number')",
   name : "type('string') minLength(3) maxLength(20)"
   age : "type('number') min(1) max(10)",
   tags : "option('tag-1','tag-2','tag-3')"
})

user({
   id: 10,
   name : 'Matias Trujillo',
   age : 24,
   tag : 'tag-1'
})

```
La salida de `user.filter(...)` sería la siguiente.
```json
{
 // data válida por el filtro
 "valid": {
   "id": 10,
   "name": "Matias Trujillo"
 },
 // path de indices inválidos, con registro de metodo
 "invalid": {
   "age": {
     "valid": false,
     "data": 24,
     "optional": false,
     "method": "max"
   },
   "tags": {
     "valid": false,
     "optional": false,
     "method": "option"
   }
 },
 // Contador de validas e invalidas
 "count": {
   "valid": 2,
   "invalid": 2
 }
}
```
## Filtros personalizados

```js
import types from "tipos";

let user = types({
   email : "email"
})

user.types.email = (next,data)=>{
   return /.+\@.+\..+/.test(data) ? next(data) : {valid : false,data};
}

user({
   email : "hello@gmail.com"
})

```

## Filtro opcional


```js
import types from "tipos";

let user = types({
   id : "type('string')?"
})

```

> Gracias al comodín `?`, la revisión permite obviar el tipo de ser inválido, de esta forma la propiedad no se registrará en el retorno como inválido.

