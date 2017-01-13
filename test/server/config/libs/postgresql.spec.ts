import { expect, assert } from 'chai';
let sinon = require('sinon');
require('sinon-as-promised');
import { resolve } from 'path';
import { ThirdPartyModules } from '../../../../config/libs/3rd_party_modules';
import { Config } from '../../../../config/config';
import { PostgreSql } from '../../../../config/libs/postgresql';

describe('PostgreSql  class', () => {
  let stubs: any[] = [];
  let modelMock: any;
  let modelMockAssociate: any;
  let sequelizeMock: any;
  let config: any;
  let mockError: any;
  let mockError2: any;
  let dbMock: any = { sequelizeDB: 'db' };

  function sequelizeImport(model: string) {
    if (model === resolve('associate')) {
      return modelMockAssociate;
    } else if (model === resolve('noAssociate')) {
      return modelMock;
    }
  }

  beforeEach(() => {
    mockError = undefined;
    mockError2 = undefined;
    modelMock = {
      name: 'noAssociate'
    };
    modelMockAssociate = {
      name: 'withAssociate',
      associate: sinon.spy()
    };
    sequelizeMock = {
      authenticate: () => {
        return new Promise((resolve) => {
          resolve(mockError);
        });
      },
      sync: (options: any) => {
        return new Promise((resolve, reject) => {
          if (mockError2) {
            reject(mockError2);
          } else if (dbMock) {
            resolve(dbMock);
          }
        });
      },
      close: sinon.spy(),
      import: sinon.spy(sequelizeImport)
    };
    class SequelizeModule {
      constructor() {
        return sequelizeMock;
      }
    }
    stubs.push(sinon.stub(ThirdPartyModules, 'Sequelize').returns(SequelizeModule));
    config = {
      files: {
        server: {
          postgresModels: []
        }
      },
      postgres: {
        options: {
          host: 'localhost',
          port: '5432',
          database: 'burgerstack_test',
          username: 'burgerstack',
          password: 'changeme',
          logging: false
        },
        sync: {
          force: false
        }
      }
    };
    stubs.push(sinon.stub(Config, 'config').returns(config));
  });

  afterEach(() => {
    stubs.forEach((stub) => {
      stub.restore();
    });
    stubs = [];
    PostgreSql.disconnect();
  });

  describe('Singleton staffs', () => {
    it('.getInstance(), should return an PostgreSql instance.', () => {
      expect(PostgreSql.getInstance()).instanceOf(PostgreSql);
    });

    it('new PostgreSql  instance should get an error', () => {
      expect(() => { new PostgreSql(); }).throws('Error: Instantiation failed: Use PostgreSql.getInstance() instead of new.');
    });
  });

  describe('.getSequelize', () => {
    it('should return sequelize instance after connect', async () => {
      await PostgreSql.connect();
      expect(PostgreSql.getSequelize()).to.equals(sequelizeMock);
    });

    it('should get undefined after disconnect', async () => {
      await PostgreSql.connect();
      PostgreSql.disconnect();
      expect(PostgreSql.getSequelize()).to.equals(undefined);
    });
  });

  describe('.getUri', () => {
    it('should return correct postgres uri after connect', async () => {
      let uri = 'postgres://localhost:5432/burgerstack_test';
      await PostgreSql.connect();
      expect(PostgreSql.getUri()).to.equals(uri);
    });

    it('should get "" after disconnect', async () => {
      await PostgreSql.connect();
      PostgreSql.disconnect();
      expect(PostgreSql.getUri()).to.equals('');
    });
  });

  describe('.connect', () => {
    it('should reject with error if any error occurs', async () => {
      mockError = new Error('fake error msg');
      let logStub = sinon.stub(console, 'log', () => { });
      let errStub = sinon.stub(console, 'error', () => { });
      await PostgreSql.connect().catch((err: any) => {
        logStub.restore();
        errStub.restore();
        expect(err).to.equal(mockError);
      });
    });

    it('should reject with error if any error occurs in sequilzie.sync', async () => {
      mockError2 = new Error('fake error msg2');
      await PostgreSql.connect().catch((err: any) => {
        expect(err).to.equal(mockError2);
      });
    });

    it('should resolve db connection if successful', async () => {
      await PostgreSql.connect().then((db) => {
        // console.log(db);
        assert(true);
      });
    });
  });

  describe('.diconnect', () => {
    it('should call sequelize.close if connected to db', async () => {
      await PostgreSql.connect();
      PostgreSql.disconnect();
      assert(sequelizeMock.close.called);
    });

    it('should not call sequelize.close if not connected', () => {
      PostgreSql.disconnect();
      assert(!sequelizeMock.close.called);
    });
  });

  describe('.loadModels', () => {
    it('should load modules', async () => {
      config.files.server.postgresModels = ['noAssociate'];
      await PostgreSql.connect();
      PostgreSql.loadModels();
      assert(sequelizeMock.import.withArgs(resolve('noAssociate')).called);
    });

    it('should associate db if model has associate method', async () => {
      modelMock = {
        name: 'fakeModel',
        associate: sinon.spy()
      };
      config.files.server.postgresModels = ['associate'];
      await PostgreSql.connect();
      PostgreSql.loadModels();
      assert(modelMockAssociate.associate.called);
    });
  });
});
