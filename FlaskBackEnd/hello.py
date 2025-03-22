from flask import Flask,jsonify,request 

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = { 
            "Modules" : 15, 
            "Subject" : "Data Structures and Algorithms", 
        } 
        return jsonify(data)
    else:
        return 'This is get request'