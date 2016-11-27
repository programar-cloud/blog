---
title: Microservicios REST en 10 minutos con SpringBoot
date: 2016-11-27T8:50:20+02:00
description: "Una introducción de guerrilla a la programación de microservicios REST en java"
slug: microservicios-rest-en-10-minutos-con-springboot
draft: true
tags:
- diseño
- rest
- microservicios
- programación
- java
- springboot
temas:
- Microservicios
niveles:
- Intermedio

disqus_identifier: microservicios-rest-en-10-minutos-con-springboot
disqus_title: Microservicios REST en 10 minutos con SpringBoot
disqus_url: "//programar.cloud/post/microservicios-rest-en-10-minutos-con-springboot"
---

{{% img src="/media/cloud-money.jpg" alt="Dinero y poder en el cloud" %}}

*TL:DR; ¡Al turrón! Vamos a crear nuestro primer microservicio desde 0 y en diez minutos.*

¡Ha llegado el momento! Tenemos el *mindset* adecuado, hemos leído sobre las ventajas, estamos llenos y llenas de entusiasmo sobre microservicios basados en webapis. Así que vamos a crear uno, desde cero.

Si no lo tienes ya instalado descarga el soporte para Java y un editor de código. Por ejemplo puedes usar el ([JDK de Sun y Netbeans de Apache](//www.oracle.com/technetwork/articles/javase/jdk-netbeans-jsp-142931.html)).

Recuerda que todas y cada una de las fases que vamos a ver las desarrollaremos más adelantes con ejemplos mucho más sofisticados y dedicándole más tiempo. Y que ahora sí, el contenido de los vídeos es imprescindible para seguir esta entrada. No dejes de verlos.

## El plan

- Diseñaremos nuestro microservicio alrededor de un recurso
- Crearemos el proyecto
- Implementaremos un API básica de CRUD (bueno, una parte al menos)
- Añadiremos unos mínimos tests
- Agregaremos pantallas para interactuar con humanos

## Diseño

Corresponde a una historia muy sencilla de este tipo:

Como responsable del catálogo quiero poder crear, ~leer, modificar y borrar~ las fichas correspondientes a un producto, así como listarlas.

Rápidamente habrás detectado dos sustantivos: catálogo y producto. El primero no parece ser más que una colección del segundo, así que **producto** será el recurso que queramos manipular.

## Creación del proyecto

Utilizaremos SpringBoot, el framework que ha convertido Java de nuevo en una plataforma sexy. Básicamente te proporcionará un montón de piezas prefabricadas y preconfiguradas y tú solo tienes que encajándolas y modificando los detalles que te convenga.

Visita [Spring Start](//start.spring.io) y crea un proyecto que incluya los módulos web (para crear el endpoint del web service), data-jpa (para manipular la base de datos), derby (una base de datos) y lombok (porque menos java es más). Descarga el *zip* generado y descomprímelo en la carpeta de trabajo que elijas: ahí tienes un proyecto basado en Maven, una herramienta que ayuda a gestionar las dependencias y el ciclo de vida del software.  Como *group id* puedes usar "cloud.programar" y como *artifactId* "microservicedemo".

Usa Netbeans (o tu veneno preferido) para abrir el proyecto y compilarlo. Debería detectar que está basado en Maven y descargar automáticamente todas las librerías necesarias. 

## Programación del modelo

Bien, vamos a encargarnos del modelo. Vamos a definir la clase ```Product``` y aquí tienes un concepto clave en microservicios: mantén las cosas simples.

```Java
@Entity 
@Table(name = "products")
@Data @AllArgsConstructor @NoArgsConstructor
@EqualsAndHashCode(of = "reference")
public class Product implements Serializable {
    @Id @GeneratedValue
    private int id;

    @Size(min=1)
    private String reference;
    @Size(min=1)
    private String name;
    @Min(0)
    private BigDecimal price;
}
```

¡Fácil, eh? Bueno, más adelante veremos que no tanto, cuando discutamos algunas decisiones de diseño y tengamos en cuenta la gestión del stock y otras reglas de negocio. Pero ahora mismo con estas líneas ya tenemos una primera versión: una clase cuyos objeto se almacenan automáticamente en la tabla ```products```, tienen un identificador único autogenerado y una serie de atributos para guardar los datos relevantes. ¿Y el resto del código? Ya sabes, los *set*, *get*, *constructores*, *equals*, *hashcode*, las comprobaciones de formato, etc. Ese código que realmente solo aporta ruído en la mayoría de los casos. Ese código que llevas años generando automáticamente. Bueno, pues eso es lo que sucede exactamente: las anotaciones se encargan de crearlo por ti.

{{% youtube Mw3ATcB1PnU %}}

## Configurando la persistencias

Como te decía usaremos Derby, una pequeña (pero interesante) base de datos relacional escrita en Java. Haremos que nuestro pequeño juguete cree una base de datos limpia al arrancar en memoria que por supuesto se eliminará cuando apaguemos la aplicación. Pero para jugar nos vendrá perfecto.

Vamos a configurarlo todo. Para ello vamos a utilizar *yaml*, un formato de documento estructurado que en general es muy legible y práctico (¡más que json!). En otro momento te contaré cómo gestionar configuraciones dinámicas que dependan del entorno en el que lanzas la aplicación. pero ahora mismo crea el fichero ```src/main/resources/application.yml``` con el siguiente contenido:

```yaml
spring:
  datasource:
    driverClassName: org.apache.derby.jdbc.EmbeddedDriver
    url: jdbc:derby:memory:demo;create=true
    username: APP
    password: bragasdeesparto
  jpa:
    database-platform :  org.hibernate.dialect.DerbyDialect
    hibernate:
        ddl-auto: update
        naming_strategy: org.hibernate.cfg.ImprovedNamingStrategy
    show-sql: true          
```

Vamos a añadir la interface que nos permitirá cargar y guardar productos. Si es tu primer @Repository vas a llorar de alegría.

```Java
@Repository
public interface ProductRepository extends CrudRepository<Product, Integer> {
    Product findByReference(String reference);
}
```

¿Ya? Bueno, no te he contado como se realiza la paginación, pero sí: Spring es capaz de generar automáticamente el código necesario para implementar los métodos que recuperan objetos a partir de los atributos que tienen un nombre determinado.

{{% youtube Mw3ATcB1PnU %}}


## Controladores

Bien, toca publicar operaciones sobre el recurso. En este caso vamos a querer dar de alta nuevos productos y a recuperar la lista de todos los productos disponibles.

A nivel semántico manipularemos el recurso ```product``` mediante las operaciones HTTP ```POST``` (crear) y ```GET``` (obtener). Dado que estamos en un triste CRUD sin reglas de negocio no implementaremos decidimos acoplar directamente el controlador con el repositorio.

```Java
@RestController
@RequestMapping("/products")
public class ProductCtrl {

    @Autowired
    @PostMapping
    public Product createNewProduct(@RequestBody @Valid Product product, ProductRepository repo) {
        product = repo.save(product);
        return product;
    }

    @Autowired
    @GetMapping
    public List<Product> retrieveAllProducts(ProductRepository repo) {
        List<Product> result = new ArrayList<>();
        repo.findAll().forEach(result::add);
        return result;
    }

    @Autowired
    @GetMapping("/{reference}")
    public List<Product> retrieveProductByRef(@PathVariable @Size(min=1) String reference, ProductRepository repo) {
        List<Product> result = new ArrayList<>();
        repo.findAll().forEach(result::add);
        return result;
    }
}
```

¿WOT? ¿Ya está? Sí. Bueno, no: faltan los tests, claro. Y un montón de funcionalidad de negocio, la paginación, el HATEOAS, la seguridad, etc. Pero al generar el proyecto se creo una clase ```MicroservicedemoApplication``` con la siguiente línea: ```SpringApplication.run(MicroservicedemoApplication.class, args);``` que al ejecutarse lanzará automáticamente un servidor de aplicaciones incrustado para publicar en la url ```/products``` un *endopoint* para la operación ```POST``` y otro para  las operaciones```GET```. La invocación de los mismos inyectará los objetos necesarios automáticamente (como el repositorio, más sobre IoC/DI en otro capítulo) e invocará el método que tiene la lógica para llevar a cabo la escritura o la lectura de la base de datos. El resultado se transformará automáticamente en un documento JSON (por defecto) y se remitirá al cliente. Habemus API.

# Testing

Se me caería la cara de vergüenza si os dejo sin ver cómo se crea un test simple. En este caso no tenemos ninguna operación de negocio realmente interesante así que el único test que tiene sentido es de integración: ver que todo se comporta como debería cuando se invoca la operación http correspondiente. Hay varias opciones, pero aquí tienes un ejemplo sobre cómo se podría chequear:

```Java
package cloud.programar.microservicedemo;

import java.math.BigDecimal;
import java.util.List;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, 
     statements = "delete from products; "
                 +"insert into products (reference, name, price) values ('testAAAA', 'Dalek tshirt', 10.0); "
                 +"insert into products (reference, name, price) values ('testBBBB', 'Bad Wolf tshirt', 10.0); "
)
public class DemoAPIIT {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testSaveNewProduct() {
        Product product  = new Product(0, "TestCCCC", "The Doctor tshirt", new BigDecimal("10.00"));
        HttpEntity<Product> entity = new HttpEntity<>(product);
        ResponseEntity<Product> response
                = restTemplate.exchange("/products",  HttpMethod.POST, entity, Product.class);

        assertEquals("Invocation was a success", HttpStatus.OK,
                response.getStatusCode());

        assertEquals("The response is equivalent to the original",
                product, response.getBody());
        assertNotEquals("The response id is not 0 because it is already persisted", 0, response.getBody().getId());
    }

    @Test
    public void testFindProducts() {
        ResponseEntity<List> response
                = restTemplate.exchange("/products",  HttpMethod.GET, null, List.class);
        List<Product> list = response.getBody();

        assertEquals("Invocation was a success", HttpStatus.OK,
                response.getStatusCode());

        assertEquals("We have two products in the system",
                2, list.size());

    }

}
```











