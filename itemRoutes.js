const express = require("express");
const { nextTick } = require("process");
const router = new express.Router();

const items = require("./fakeDb");
const expressError = require("./expressError");


router.get("/", function(req, res, next) {
    try {
        return res.json(items);
    }
    catch(err) {
        return next(err)
    }
})

router.post("/", function(req, res, next) {
    try{
        if (!req.body.name) {
            throw new expressError("Name is required", 400)
        } else {
            const idx = items.findIndex(i => i.name === req.body.name && i.price == +req.body.price);
            if (idx == -1) {
                console.log(idx);
                console.log(req.body.name);
                items.push({name: req.body.name, price: req.body.price});
                return res.send({"added": {name: req.body.name, price: req.body.price}});
            }
            throw new expressError("This item is already on the list", 403)
        }
        
    }
    catch(err) {
        return next(err)
    }
})

router.get("/:name", function(req, res, next) {
    try{
        const idx = items.findIndex(i => i.name === req.params.name);
        if (idx == -1) {
            throw new expressError(`Could not find item - ${req.params.name}`, 400)
        }
        return res.json(items[idx]);
    }
    catch(err) {
        return next(err)
    }    
})

router.patch("/:name", function(req, res, next) {
    try {
        if (!req.body.name) {
            throw new expressError("Name is required", 400)
        } else {
            const idx = items.findIndex(i => i.name === req.params.name);
            if (idx == -1) {
                throw new expressError(`Could not find item - ${req.params.name}`, 400)
            }
            items[idx] = {name: req.body.name, price: req.body.price};
            return res.json({"updated": items[idx]});
        }
    }
    catch(err) {
        return next(err);
    }
})

router.delete("/:name", function(req,res, next) {
    try {
        const idx = items.findIndex(i => i.name === req.params.name);
        if (idx == -1) {
            throw new expressError(`Could not find item - ${req.params.name}`, 400)
        }
        items.splice(idx, 1);
        return res.json({message: 'Deleted'})
    }
    catch(err) {
        return next(err);
    }
})

module.exports=router;