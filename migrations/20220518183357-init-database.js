'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
    create table usr (
      id_usr serial not null,
      login char(12) not null, 
      name char(50) not null,
      password varchar not null,
      idt_role char(1) not null check (idt_role in ('A','C','S')), -- Administrador, Corporate, startup
      description text not null,
      tsv_txt tsvector not null,
      st_usr char(1) not null check (st_usr in ('P','A')), -- Pendente, Ativo
      primary key (id_usr)
  );
  
  create unique index i_login on usr (login);
  
  create table corporate (
      id_usr int not null, 
      file bytea[],  -- Index 0 corresponde ao ícone
      primary key (id_usr)    
  );
  Alter table corporate add foreign key (id_usr)
    references usr (id_usr) on delete cascade
                            on update cascade;
  
  
  create table startup (
      id_usr int not null,
      file bytea[],  -- Index 0 corresponde ao pitch 
      primary key(id_usr)
  );
  Alter table startup add foreign key (id_usr)
    references usr (id_usr) on delete cascade
                            on update cascade;
  
  
  create table service (
      id_service serial not null,
      item smallint not null,
      description text not null,
      tsv_service tsvector not null,
      id_usr integer not null,
      primary key (id_service)
  );
  Alter table service add foreign key (id_usr)
    references startup (id_usr);
  
  create table demand (
      id_demand serial not null,
      description text not null,
      tsv_demand tsvector not null,
      id_usr integer not null,
      dat_post date not null,
      st_demand char(1) not null check (st_demand in ('A','I')), -- Ativo, Inativo
      primary key (id_demand)
  );
  Alter table demand add foreign key (id_usr)
    references corporate (id_usr);
  
  create table proposal (
      id_proposal serial not null,
      description text not null,
      tsv_proposal tsvector not null,
      id_usr integer not null,
      id_demand integer not null,
      dat_post date not null,
      st_proposal char(1) not null check (st_proposal in ('E','A','R')), -- Enviada, Aceita, Recusada
      primary key (id_proposal)
  );
  Alter table proposal add foreign key (id_usr)
    references startup (id_usr);
  Alter table proposal add foreign key (id_demand)
    references demand (id_demand);
  
  create table position (
      id_position serial not null,
      name varchar not null,
      primary key (id_position)
  );
  create unique index i_name on position (name); 
  
  create table contact (
      id_contact serial not null,
      name char(50) not null,
      id_position integer not null,
      e_mail varchar not null,
      phone varchar,
      id_user integer not null,
      primary key (id_contact)
  );
  Alter table contact add foreign key (id_position)
     references position(id_position);
  
  create table schedule (
     id_schedule serial not null,
     date_meet timestamp(0) with time zone, -- Sem precisão de segundos
     id_usr_from integer not null,
     id_usr_to integer not null,
     id_contact_from integer[],
     id_contact_to integer[],
     st_schedule_from char(1) not null check (st_schedule_from in ('P','A','R')), -- Pendente, Aceito, Recusado
     st_schedule_to char(1) not null check (st_schedule_to in ('P','A','R')), -- Pendente, Aceito, Recusado
     primary key (id_schedule)
  );
  -- to/from pode ser corporate/startup ou vice-versa
  Alter table schedule add foreign key (id_usr_from) references usr(id_usr);
  Alter table schedule add foreign key (id_usr_to) references usr(id_usr);
  
  CREATE OR REPLACE FUNCTION upd_tsv_txt() RETURNS trigger AS
  $$
  begin
  new.tsv_txt := 
  setweight(to_tsvector(coalesce(new.name,'')),'A') ||
  setweight(to_tsvector(coalesce(new.description,'')),'B') ;
  
  return new;
  end
  $$ LANGUAGE plpgsql;
  
  CREATE TRIGGER tg_upd_tsv_txt BEFORE INSERT OR UPDATE
  ON usr FOR EACH ROW EXECUTE PROCEDURE upd_tsv_txt();
  
  
  CREATE OR REPLACE FUNCTION upd_tsv_service() RETURNS trigger AS
  $$
  begin
  new.tsv_service := to_tsvector(new.description) ;
  return new;
  end
  $$ LANGUAGE plpgsql;
  
  CREATE TRIGGER tg_upd_tsv_service BEFORE INSERT OR UPDATE
  ON service FOR EACH ROW EXECUTE PROCEDURE upd_tsv_service();
  
  CREATE OR REPLACE FUNCTION upd_tsv_demand() RETURNS trigger AS
  $$
  begin
  new.tsv_demand := to_tsvector(new.description) ;
  return new;
  end
  $$ LANGUAGE plpgsql;
  
  CREATE TRIGGER tg_upd_tsv_demand BEFORE INSERT OR UPDATE
  ON demand FOR EACH ROW EXECUTE PROCEDURE upd_tsv_demand();
  
  CREATE OR REPLACE FUNCTION upd_tsv_proposal() RETURNS trigger AS
  $$
  begin
  new.tsv_proposal := to_tsvector(new.description) ;
  return new;
  end
  $$ LANGUAGE plpgsql;
  
  CREATE TRIGGER tg_upd_tsv_proposal BEFORE INSERT OR UPDATE
  ON proposal FOR EACH ROW EXECUTE PROCEDURE upd_tsv_proposal();
  
  
  
  insert into usr (id_usr, login, name, password, idt_role,
      description, st_usr)
  values
     (1, 'Edson', 'Edson Marchetti da Silva', '123456','C',
      'Esta coporação desenvolve trabalhos relacionados a desnvolvimento de software utilizando arquitetura MVC no ambiente',
     'A'), 
     (2, 'Pedro', 'Pedro Elias', '123456','C',
      'Aluno de TCC do curso de engenharia de computaçãoo',
     'A'),
     (3, 'Layla', 'Layla', '123456','S',
      'Aluna do curso técnico em informática','A'), 
     (4, 'Evelyn', 'Evelin laura', '123456','S',
      'Aluna do curso técnico em informática', 'A'), 
     (5, 'Agatha', 'Agatha', '123456','S',
      'Aluna do curso técnico em informática','A'), 
     (6, 'Bryan', 'Bryan', '123456','S',
      'Aluno do curso técnico em informática',
     'A');
   
  
  
  insert into corporate (id_usr, file)
  values
     (1, null),
     (2, null);
  
  insert into startup (id_usr, file)
  values
     (3, Null),
     (4, Null),
     (5, null),
     (6, null);
  
  
  
  insert into service (id_service, item, description, id_usr)
     values
       (1,1, 'Desenvolvimento em Javascript com Angular ou React', 3),
       (2,2, 'Elaboração de projeto utilizando métodos ágeis', 3),
       (3,3, 'Desenvolvimento de projeto arquitetural considerando os padrões GRASP', 3),
       (4, 1, 'Desenvolvimento de projeto Java com framework Spring Boot ou Micronaut', 4),
       (5, 2, 'Desenvolvimento em plataforma Android', 4);
  
  insert into demand (id_demand, description, id_usr, dat_post, st_demand)
  values
      (1, 'Estamos iniciando um projeto para criação do sistema aplicativos para gestão a carteira de investimentos do cliente em plataforma mobile. Demandamos por parceiros que tenha experiência de projeto executados e em funcionamento que utilizam Kotlin com backend em microsserviços', 1, '2022/05/26', 'A'), 
      (2, 'NÃO MOSTRAR Estamos iniciando um projeto para criação do sistema aplicativos para gestão a carteira de investimentos do cliente em plataforma mobile. Demandamos por parceiros que tenha experiência de projeto executados e em funcionamento que utilizam Kotlin com backend em microsserviços', 1, '2022/05/26', 'I') ;
  
  insert into proposal (id_proposal, description, id_usr,
      id_demand,  dat_post, st_proposal)
  values
      (1, 'Nos somos uma startup com 5 anos de mercado e desenvolvemos soluções financeiras para o PagPay e BS2. Disposmos de uma solução que pode se adequar a demanda apresentada',
  3, 1, '2022/05/26', 'E');
  
  
  insert into position (id_position, name)
   values
      (1, 'Chief Executive Officer'),
      (2, 'Vice-president');
  
  
  insert into contact (id_contact, name, id_position, e_mail,
      phone, id_user)
  values
     (1, 'John Barnes', 1, 'barnes@gmail.com', '+1 (11)9999-8888', 1),
     (2, 'Mary Jhones', 2, 'jhones@gmail.com', '+1 (11)9999-7777', 3);
    
  
  insert into schedule (id_schedule, date_meet, id_usr_from,
     id_usr_to, id_contact_from, id_contact_to, 
     st_schedule_from,   st_schedule_to)
  values
     (1, now(), 3, 1, '{2}', '{1}', 'P', 'P');
  
  /* Sqls
     Select name, description 
       from usr
      where idt_role <> $1 and idt_role <> 'A'
        and tsv_txt @@ plainto_tsquery($2, $3)
        and st_usr = 'A';
  
  */
  
  `, { logging: console.log })

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
