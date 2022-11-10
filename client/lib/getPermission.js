const permission = localStorage.getItem(Meteor.userId() + 'permission')
if (permission && permission.length > 0) {
  Session.set('permission', permission);
} else {
  Session.set('permission', []);
}

Tracker.autorun(() => {
  Meteor.call('hasPermission', function (err, result) {
    if (!err){
      Session.set('permission', result);
    }
  });
});
