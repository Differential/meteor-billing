Meteor.startup ->

	# Publish user with billing object
	Meteor.publish 'currentUser', ->
	  Meteor.users.find _id: @userId, 
	    fields: billing: 1

	# Patch any existing/new users up with an empty billing object
	cursor = Meteor.users.find()
	cursor.observe
		added: (usr) ->
			unless usr.billing
				Meteor.users.update _id: usr._id,
					$set: billing: {}