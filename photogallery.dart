PhotoViewGallery.builder(
          scrollPhysics: const BouncingScrollPhysics(),
          builder: (BuildContext context, int index) =>
              PhotoViewGalleryPageOptions(
            onTapDown: (context, details, controllerValue) =>
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (_) => FullScreenImage(               //when the user taps on the image, it will go fullscreen
                        imageIDs: _vendor.imageIds, index: index))),
            maxScale: PhotoViewComputedScale.contained * 2.0,
            minScale: PhotoViewComputedScale.contained * 0.8,
            imageProvider:
                VendorDBService.getVendorImage(_vendor.imageIds[index]),  //vendor will be replaced by post accordingly
            heroAttributes:
                PhotoViewHeroAttributes(tag: _vendor.imageIds[index]),
          ),
          itemCount: _vendor.imageIds.length,
          loadingBuilder: (context, event) => Center(
            child: Container(
              width: 20.0,
              height: 20.0,
              child: CircularProgressIndicator(
                value: event == null
                    ? 0
                    : event.cumulativeBytesLoaded / event.expectedTotalBytes,
              ),
            ),
          ),
          backgroundDecoration:
              BoxDecoration(color: Theme.of(context).canvasColor),
        ),