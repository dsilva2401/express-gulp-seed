module.exports = function (sequelize, DataTypes) {

	var Credential = sequelize.define('Credential', {
		password: DataTypes.STRING
	}, {
		classMethods: {
			associate: function (models) {
				Credential.belongsTo( models.User );
			}
		}
	});

	return Credential;
};