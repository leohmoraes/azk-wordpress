systems({
  wordpress: {
    depends: ["mysql"],
    image: {"docker": "azukiapp/php-apache"},
    provision: [
      "./install-wordpress.sh",
      "npm install"
    ],
    workdir: "/azk/app",
    shell: "/bin/bash",
    wait: 20,
    mounts: {
      "/azk/app":                   sync(".", { shell: true }),
      "/azk/app/node_modules":      persistent("node_modules"),
      "/azk/app/public":            persistent("public"),
      "/azk/app/public/wp-content": path("public/wp-content")
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "80/tcp",
      livereload: "35729:35729/tcp"
    },
    envs: {
      APP_DIR: "/azk/app",
    },
  },
  mysql: {
    image: {"docker": "azukiapp/mysql:5.7"},
    shell: "/bin/bash",
    wait: 25,
    mounts: {
      '/var/lib/mysql': persistent("mysql_data"),
    },
    ports: {
      data: "3306:3306/tcp",
      livereload: "35729:35729/tcp"
    },
    envs: {
      MYSQL_USER         : "azk",
      MYSQL_PASSWORD     : "azk",
      MYSQL_DATABASE     : "azk",
      MYSQL_ROOT_PASSWORD: "azk",
    },
    export_envs: {
      MYSQL_USER    : "#{envs.MYSQL_USER}",
      MYSQL_PASSWORD: "#{envs.MYSQL_PASSWORD}",
      MYSQL_HOST    : "#{net.host}",
      MYSQL_PORT    : "#{net.port.data}",
      MYSQL_DATABASE: "#{envs.MYSQL_DATABASE}"
    },
  },
  phpmyadmin: {
    depends: ["mysql"],
    image: { docker: "reduto/phpmyadmin" },
    wait: 25,
    scalable: {default: 1, limit: 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "80/tcp",
    },
  }
});

setDefault("wordpress");
