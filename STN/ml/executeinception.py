from pathlib import Path

import tensorflow as tf
from django.conf import settings
from imageio.plugins._bsdf import Blob


def predict(img):
    # Loads label file, strips off carriage return
    label_lines = [line.rstrip() for line
                   in
                   tf.compat.v1.gfile.GFile(Path.joinpath(settings.BASE_DIR, "STN/ml", "inception/output_labels.txt"))]

    # Unpersists graph from file
    f = tf.compat.v1.gfile.FastGFile(Path.joinpath(settings.BASE_DIR, "STN/ml", "inception/output_graph.pb", 'rb'))
    graph_def = tf.compat.v1.GraphDef()
    graph_def.ParseFromString(f.read())
    _ = tf.import_graph_def(graph_def, name='')
    with tf.compat.v1.Session() as sess:
        blob = Blob(img, 'rb')
        image_data = blob.read(blob.get_bytes())
        # Feed the image_data as input to the graph and get first prediction
        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
        predictions = sess.run(softmax_tensor, {'DecodeJpeg/contents:0': image_data})
        # Sort to show labels of first prediction in order of confidence
        top_k = predictions[0].argsort()[-1:][::-1]

        for node_id in top_k:
            human_string = label_lines[node_id]
            score = predictions[0][node_id]
            print('%s (score = %.5f)' % (human_string, score))
            s = str(human_string) + " " + str(score * 100) + "%"
    return "A"
