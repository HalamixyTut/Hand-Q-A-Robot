import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { Option } from '../coding/option';

let storagePath = Option.find({cname: 'AVATAR_PATH'}).fetch();
if(storagePath && storagePath.length > 0) {
  storagePath = storagePath[0].name;
} else {
  storagePath = '';
}

export const Images = new FilesCollection({
  storagePath: storagePath,
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  cacheControl: 'public, max-age=0',
  onBeforeUpload: function (file) {
    if(!/png|jpe?g/i.test(file.extension)) {
      return '请上传png/jpg/jpeg图片!';
    }
    if (file.size > 1024 * 1024) {
      return '上传图片尺寸不能超过1M!';
    }

    return true;
  },
});

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });

  Meteor.methods({
    'save.user.img'(userId) {
      const img = Images.findOne({_id: userId});

      if(img) {
        img.remove()
      }
    },

    'get.img.url'(imgId) {
      const img = Images.findOne({_id: imgId});
      if(img) {
        return Images.findOne({_id: imgId}).link('original', '/')
      }else {
        return false
      }
    },

    'chat.get.img.url'(imgId) {
      const img = Images.findOne({_id: imgId});
      if(img) {
        console.log(11);
        return Images.findOne({_id: imgId}).link('original', '/')
      }else {
        return Images.findOne() ? Images.findOne().link('original', '/') : ''
      }
    },
  })
}else {
  Meteor.subscribe('files.images.all');
}
