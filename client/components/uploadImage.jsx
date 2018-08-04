import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';
import {UPLOAD_IMAGE_ENDPOINT} from "../endpoints";
import {Gen} from "../helpers/gen";


class UploadImage extends Component {



    constructor(props){
        super(props);
    }

    preloadImages(dropzone) {
        (this.props.images || []).forEach( function (i) {
            var name = Gen.baseName(i);
            var file = { url: i.url, name: name };
            var width = 100;
            var height = 100;
            var imageUrl = i;

            dropzone.emit("addedfile", file);
            dropzone.emit("thumbnail", file, imageUrl);
            dropzone.emit("complete", file);
        });
    }

    render(){

        const {addImage, removeImage, images} = this.props;
        return(
            <DropzoneComponent config={{
                iconFiletypes: ['.jpg', '.png', '.gif'],
                showFiletypeIcon: true,
                postUrl: UPLOAD_IMAGE_ENDPOINT
            }}
                eventHandlers={{
                    init: (dropzone) => {
                        this.preloadImages(dropzone);
                    },
                    addedfile: (file) => console.log(file),
                    success: (data, res) => {
                        console.log(res);
                        addImage(res.success.data.uploadUrl);
                    },
                    removedfile: (data) => {
                        console.log(data);
                    }
                }}
                djsConfig={{
                    // addRemoveLinks: true
                }}
            />
        )
    };
}

UploadImage.propTypes = {
    images: PropTypes.array,
    addImage: PropTypes.func.isRequired,
    removeImage: PropTypes.func.isRequired,
}

export default UploadImage;