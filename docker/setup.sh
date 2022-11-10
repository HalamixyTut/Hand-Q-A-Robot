#!/bin/bash
mongo <<EOF
use admin;
db.createUser({ user: 'root', pwd: 'root123', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });

use aibot_db;
db.createUser({ user: 'apps', pwd: 'apps123', roles: [ { role: "readWrite", db: "aibot_db" } ] });

use aibot_db;
db.createCollection("collection_demo");
EOF
