# instance_utilities
Utilitaire & Monitoring d'instance

# Monitoring

## Prometheus & Node Exporter:

La stack de monitoring est composé de 2 outils, Prometheus et Grafana, ainsi que d'un plugin pour Prometheus.

Prometheus permet de générer des metrics sur différents process ou applications.
Le plugin Node exporter qui lui est associé permet de générer des metrics sur des filesystems. En l'occurence le host filesystem.

Pour configurer Prometheus, un fichier prometheus.yml se trouve dans le répertoire prometheus à la racine du projet.

```yaml
# Prometheus basic config
global:
  scrape_interval:     15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
#alerting:
#  alertmanagers:
#  - static_configs:
#    - targets:
#      # - alertmanager:9093

# None for now.
rule_files:
  # - "alerts.yml" Could be one.

# Node Exporter job
scrape_configs:
  - job_name: 'nodeexporter'
    static_configs:
    - targets: ['nodeexporter:9100']
```

Les champs sont expliqués en commentaires. Parmis les choses qui ne le sont pas :
AlertManager permet de créer des alertes, notament des alertes mails, quand des metrics spécifiques passe des seuils critiques. On pourrait par exemple définir que si l'espace disk occupé dépasse les 90%, alert manager envoie un mail/slack toutes les x heures.

Pour scrape_configs: La target est ici liée au nom du service docker. Pour cette raison, prometheus et ses target doivent se trouver soit sur le même docker network, soit faire un accès via un autre protocal (http possible).

## Grafana

Grafana est un outil permettant de visualiser des metrics sous forme de graph, et de les organiser dans des Dasboards.

L'UI web de Grafana est assez fournie et on peut facilement s'y perdre. De plus pour créer des metrics il faut utiliser PromQL, le langage de query Prometheus, et donc passer un peu de temps dans la doc. Je vais créer le premier graph d'utilisation de disque sur la plateforme, comme ça on aura un premier Dashboard (avec 1 graph, certes) pour commencer à utiliser l'outil.

La configuration de Grafana se trouve dans le repertoir Grafana de la racine du projet.


```yaml
# datasources.yml
# config file version
apiVersion: 1

# list of datasources that should be deleted from the database
deleteDatasources:
  - name: Prometheus
    orgId: 1

# list of datasources to insert/update depending
# whats available in the database
datasources:
  # <string, required> name of the datasource. Required
  - name: Prometheus
    # <string, required> datasource type. Required
    type: prometheus
    # <string, required> access mode. direct or proxy. Required
    access: proxy
    # <int> org id. will default to orgId 1 if not specified
    orgId: 1
    # <string> url
    url: http://prometheus:9090
    # <string> database password, if used
    password:
    # <string> database user, if used
    user:
    # <string> database name, if used
    database:
    # <bool> enable/disable basic auth
    basicAuth: false
    # <string> basic auth username, if used
    basicAuthUser:
    # <string> basic auth password, if used
    basicAuthPassword:
    # <bool> enable/disable with credentials headers
    withCredentials:
    # <bool> mark as default datasource. Max one per org
    isDefault: true
    # <map> fields that will be converted to json and stored in json_data
    jsonData:
      graphiteVersion: "1.1"
      tlsAuth: false
      tlsAuthWithCACert: false
    # <string> json object of data that will be encrypted.
    secureJsonData:
      tlsCACert: "..."
      tlsClientCert: "..."
      tlsClientKey: "..."
    version: 1
    # <bool> allow users to edit datasources from the UI.
    editable: true

```

Ici le datasource.yml permet de configurer à l'avance une source de donnée pour Grafana.
On peut également configurer une authentification, la méthode d'accès etc.
L'accès à la datasource se fait via le Docker network.

Il est également possible dans un autre fichier de modifier la configuration de grafana, comme le port utilisé etc. Ces options ne sont toutefois pour l'instant pas utilisées.

Grafana est actuellement configurer pour s'ouvrir sur le port 3000.

# Portail d'utilitaires

Le front présente actuellement toutes les features proposées par l'api.
Celles-ci sont peu nombreuses:

(les noms sont bien évidement changeables si ils ne conviennent pas ou ne sont pas clairs, de plus les variables d'environnements stipulées sont set dans le docker-compose.yml)

Sur la route /manager/keys:
* GET : Permet de récupérer le contenu du fichier au chemin spécifié par la variable d'environnement KEYS_FILE.
* POST : Permet d'écraser le fichier pour le remplacer par celui passé en paramètre de la requête. Un fichier ne peut contenir moins de 2 clés ssh.

Mise à jour future à envisager : Vérifier que les clés ssh soient bien valides avant de remplacer le fichier.

Sur la route /manager/ssl:

* GET : Permet de récupérer l'état de validité des certificats liés aux noms de domaines précisés dans le fichier au chemin DOMAINS_FILE
* GET ? domain=xxxx : Permet de récupérer les mêmes informations pour un domaine passé en paramêtre.

Sur la route /manager/dbsaves:

* GET : Permet de récupérer toutes les lignes du fichier au chemin DB_LOGS_FILE.
* PUT : (Body params: nbLines) Permet de supprimer toutes les lignes du fichier sauf les nbLines dernières.

# Docker Compose

Les images de Prometheus, Node Exporter, et Grafana sont les images publiques des projets respectifs. Elles sont toutes sur Alpine.

Volumes :

* Prometheus et grafana montent leur configuration ainsi que de quoi stocker des données.
* Parmis les commandes prometheus, le --storage.tsdb.retention.time=48h  permet de limiter le stockage de données à 48h maximum.
* Node Exporter monte en volume les filesystem qu'il va checker et exclu tout les mountpoint vérifiant la regex passée à la command --collector.filesystem.ignored-mount-points=...
* L'API monte 3 fichiers : L'authorized_keys, un fichier de log db (à gérer de façon à ce qu'il y est 1 ligne par save) et un fichier de noms de domaines. Le fichier de noms de domaines est actuellement alimenté par un cron qui ls le contenu de /etc/letsencrypt/live dans le fichier. Mais cela peut être amené à changé selon l'instance.

```yaml
version: '3'

volumes:
  prometheus_data:
  grafana_data:

networks:
  manager:
  monitoring:

services:

  prometheus:
    image: prom/prometheus:v2.17.1
    container_name: prometheus
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=48h'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    expose:
      - 9090
    labels:
      com.promonitor.dev: "monitoring"
    networks:
      - monitoring

  nodeexporter:
    image: prom/node-exporter:v0.18.1
    container_name: nodeexporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc|tmp|run|var)($$|/)'
    restart: unless-stopped
    expose:
      - 9100
    labels:
      com.promonitor.dev: "monitoring"
    networks:
      - monitoring

  grafana:
    image: grafana/grafana
    container_name: grafana
    volumes: 
      - grafana_data:/var/lib/grafana
      - ./grafana/:/etc/grafana/provisioning/
    restart: unless-stopped
    ports:
      - 3000:3000
    labels: 
      com.promonitor.dev: "monitoring"
    networks:
      - monitoring

  front:
    build: ./front
    container_name: manager_front
    stdin_open: true 
    environment:
      - PORT=3001
      - API_URL=http://api:8080/manager/
    ports:
      - '3001:3001'
    labels:
      com.promonitor.dev: "manager"
    networks:
      - manager

  api:
    build: ./api
    container_name: manager_api
    volumes:
      - ~/.ssh/authorized_keys:/etc/files/authorized_keys
      - ~/dbsaves.log:/etc/files/dbsaves.log
      - ~/domains.list:/etc/files/domains.list
    environment:
      - PORT=8080
      - DB_LOGS_FILE=/etc/files/dbsaves.log
      - KEYS_FILE=/etc/files/authorized_keys
      - DOMAINS_FILE=/etc/files/domains.list
    ports:
      - '8080:8080'
    labels:
      com.promonitor.dev: "manager"
    networks:
      - manager
```


# Lancer le projet

```bash
docker-compose up -d
```

Accès à Grafana sur le port 3000.
Accès au front sur le port 3001.
Accès à l'API sur le port 8080.

# Évolutions envisagées

Faire un design pour le front.

Accèder à grafana avec des comptes preset autres que Admin/Admin.

Alimenter Grafana en metrics.

Sécuriser plus l'API au niveau de l'accès aux fichiers.

Build les images en mode production pour qu'elles prennent moins de place.
