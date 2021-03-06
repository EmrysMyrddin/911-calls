# 911 Calls avec ElasticSearch

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (ici aussi, cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
GET <nom de votre index>/_count
```

## Requêtes

À vous de jouer ! Écrivez les requêtes ElasticSearch permettant de résoudre les problèmes posés.

### Compter le nombre d'appels autour de Lansdale dans un rayon de 500 mètres

```json
GET 911-calls/call/_count
{
  "query": {
        "bool" : {
            "must" : {
                "match_all" : {}
            },
            "filter" : {
                "geo_distance" : {
                    "distance" : "500m",
                    "location" : {
                        "lat" : 40.241493,
                        "lon" : -75.283783
                    }
                }
            }
        }
    }
}
```

###Compter le nombre d'appels par catégorie
```json
GET 911-calls/call/_search
{
  "size" : 0,
  "aggs": {
        "calls" : {
            "terms" : {
                "field" : "category"
            }
        }
    }
}
```

###Trouver les 3 mois ayant comptabilisés le plus d'appels

Il est pour l'instant impossible de récupéré un top 3 des buckets retournés par une agrégation. J'ai donc ici une requette renvoyant le nombre d'appels passés par mois, triés par ordre décroissant sur le nombre d'appel. Il faudrat ensuite au niveau de l'application ne prendre que les trois premiers.

```json
GET 911-calls/call/_search
{
  "size" : 0,
  "aggs" : {
    "calls" : {
      "date_histogram" : {
        "field" : "date",
        "interval" : "month",
        "order" : { "_count" : "desc" }
      }
    }
  }
}
```

###Trouver le top 3 des villes avec le plus d'appels pour overdose


```json
GET 911-calls/call/_search
{
  "size" : 0,
  "query": {
    "bool" :{
      "filter" : {
        "term": {
          "category": "EMS"
        }
      },
      "must" : {
        "wildcard": {
          "description": {
            "value": "*overdose*"
          }
        }
      }
    }
  },
  "aggs" : {
    "calls" : {
      "terms" : {
        "field": "town",
        "size" : 3
      }
    }
  }
}
```

## Kibana

Dans Kibana, créez un dashboard qui permet de visualiser :

* Une carte de l'ensemble des appels
* Un histogramme des appels répartis par catégories
* Un Pie chart réparti par bimestre, par catégories et par canton (township)

_Supplément :_ Un graphique représentant le nombre d'appels au cours du temps.

![](images/911-calls dashboard.png)

### Timelion
Timelion est un outil de visualisation des timeseries accessible via Kibana à l'aide du bouton : ![](images/timelion.png)

Réalisez le diagramme suivant :
![](images/timelion-chart.png)

Envoyer la réponse sous la forme de la requête Timelion ci-dessous:  

```
TODO : ajouter la requête Timelion ici
```
