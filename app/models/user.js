module.exports = function (sequelize, DataTypes) {

	var User = sequelize.define('User', {
		name: DataTypes.STRING,
		email: DataTypes.STRING
	}, {
		classMethods: {
			associate: function (models) {
				// example on how to add relations
				// User.hasMany(models.Comments);
			}
		}
	});

	return User;
};