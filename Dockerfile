FROM centos:centos7.5.1804

# ENV container docker
# RUN (cd /lib/systemd/system/sysinit.target.wants/; for i in *; do [ $i == \
# systemd-tmpfiles-setup.service ] || rm -f $i; done); \
# rm -f /lib/systemd/system/multi-user.target.wants/*;\
# rm -f /etc/systemd/system/*.wants/*;\
# rm -f /lib/systemd/system/local-fs.target.wants/*; \
# rm -f /lib/systemd/system/sockets.target.wants/*udev*; \
# rm -f /lib/systemd/system/sockets.target.wants/*initctl*; \
# rm -f /lib/systemd/system/basic.target.wants/*;\
# rm -f /lib/systemd/system/anaconda.target.wants/*;
# VOLUME [ "/sys/fs/cgroup" ]
# CMD ["/usr/sbin/init"]

# Install Node
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -

# Install YARN
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum install -y yarn

# Install Dependencies
# Install Dev tools and Cairo
RUN yum groupinstall -y 'Development Tools'
RUN yum install -y cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel

# Install Postgres
RUN yum install -y https://download.postgresql.org/pub/repos/yum/10/redhat/rhel-7-x86_64/pgdg-centos10-10-2.noarch.rpm
RUN yum install -y postgresql10 postgresql10-server postgresql10-devel

# Create a user Node
RUN groupadd -r node && useradd -m -r -g node -s /bin/bash node

WORKDIR /app

COPY package*.json ./

RUN yarn install

# Copy required project files
COPY src ./src/
COPY config ./config/
COPY test ./test/
COPY tsconfig.json ./
COPY ormconfig.json ./
COPY webpack.config.js ./

# Intialize DB
# RUN systemctl start postgresql
# RUN /usr/pgsql-10/bin/postgresql-10-setup initdb
# RUN psql --command "CREATE USER test WITH SUPERUSER PASSWORD 'test';"
# RUN /usr/pgsql-10/bin/createdb -O test test

# EXPOSE 3000

# USER node

# CMD ["yarn", "start:dev"]