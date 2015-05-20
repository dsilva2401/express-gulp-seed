var Q = require("q");

module.exports = function (sequelize, DataTypes) {

	var User = sequelize.define('User', {
		name: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			unique: true
		}
	}, {
		classMethods: {
			associate: function (models) {
				
			},
			createWithCredentials: function (data) {
				var deferred = Q.defer();
				User.create({
					name: data.name,
					email: data.email
				}).then(function(user) {
					sequelize.models.Credential.create({
						password: data.password
					}).then(function(credential) {
						credential.setUser(user).then(function() {
							deferred.resolve(user);
						}).catch(function(error) {
							deferred.reject(error);
						});
					}).catch(function(error) {
						deferred.reject(error);
					});
				}).catch(function(error) {
					deferred.reject(error);
				});
				return deferred.promise;
			},
			validateCredentials: function(data) {
				var deferred = Q.defer();
				sequelize.models.User.findOne({
					where: {
						email: data.email
					}
				}).then(function(user) {
					if(!user){
						deferred.resolve(user);
						return;
					}
					sequelize.models.Credential.findOne({
						where: {
							UserId: user.id,
							password: data.password
						}
					}).then(function(credential) {
						deferred.resolve( credential ? user : null );
					}).catch(function(error) {
						deferred.reject(error);
					});
				}).catch(function(error) {
					deferred.reject(error);
				})
				return deferred.promise;
			},
			verifySession: function(req) {
				var deferred = Q.defer();
				var skData = req.cookies; 

				sequelize.models.SessionKey.findOne({
					where: {
						UserId: skData.uid,
						key: skData.sKey
					},
					include: [{
						model: User,
						as: 'User'
					}]
				}).then(function(session) {
					deferred.resolve( session ? session.User : null );
				}).catch(function (error) {
					deferred.reject(error);
				});

				return deferred.promise;
			}
		},
		instanceMethods: {
			createSession: function(response, responseAction) {
				var user = this;
				var deferred = Q.defer();
				var abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
				var keySize = 20;
				var key = '';
				for ( var i=0; i<keySize; i++ ) key += abc[Math.floor(Math.random()*abc.length)];
				sequelize.models.SessionKey.create({
					key: key
				}).then(function(sKey) {
					sKey.setUser(user).then(function(sKey) {
						response.cookie('uid', user.id, { maxAge: 900000 });
						response.cookie('sKey', key, { maxAge: 900000 });
						responseAction(sKey);
						deferred.resolve(sKey);
					}).catch(function(error) {
						deferred.reject(error);
					});
				}).catch(function(error) {
					deferred.reject(error);
				})

				return deferred.promise;
			}
		}
	});

	return User;
};