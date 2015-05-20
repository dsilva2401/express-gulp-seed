module.exports = function (sequelize, DataTypes) {

	var SessionKey = sequelize.define('SessionKey', {
		key: DataTypes.STRING
	}, {
		classMethods: {
			associate: function (models) {
				SessionKey.belongsTo( models.User );
			}
		}
	});

	return SessionKey;
};