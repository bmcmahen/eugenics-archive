window.Forms = {}

confirmation = require 'bmcmahen-confirmation'
spinner = require 'bmcmahen-canvas-loading-animation'

documentTypes = ['Event', 'Idea', 'Institution', 'Person', 'Place', 'Publication']
typeToParam =
	event : 'events'
	idea : 'ideas'
	institution : 'institutions'
	person : 'people'
	place : 'places'
	publication : 'publications'

# Field Type Schemas
fieldTypes =

	# All document require these fields
  required: ->
    title:
      widget: "text"
      label: "Title"
      required: true
    type:
      widget: "select"
      label: "Document Type"
      options: documentTypes
    shortDescription:
      widget: "text"
      label: "Short Description"
      required: true
    fullDescription:
      widget: "textarea"
      label: "Full Description"
      required: true
    image:
      widget: "image"
      label: "Image"
    resources:
      widget: "formset"
      label: "Link"
      fields: [
        widget: "text"
        label: "Resource"
      ]
    prods:
      widget: "checkbox"
      fields: [
        timeline:
          widget: "checkbox"
          label: "Timeline"
          value: ""

        heroes:
          widget: "checkbox"
          label: "Heroes and Villains"
          value: ""
      ]

  event: ->
    date:
      widget: "text"
      label: "Date"
      className: "date"
      helpText: "Format: MM/DD/YYYY"

  person: ->
    dateOfBirth:
      widget: "text"
      label: "Date of Birth"
      className: "dateOfBirth"

    dateOfDeath:
      widget: "text"
      label: "Date of Death"
      className: "dateOfDeath"

  publication: ->
    yearOfPublication:
      widget: "text"
      label: "Year of Publication"

    monthOfPublication:
      widget: "text"
      label: "Month of Publication"

    author:
      widget: "text"
      label: "Author"

    publisher:
      widget: "text"
      label: "Publisher"

  timeline: ->
    date:
      widget: "text"
      className: "date"
      helpText: "Format: MM/DD/YYYY"

    startDate:
      widget: "text"
      label: "Date Range (Start Date)"
      helpText: "If you want this entry to appear as a date range, use this field. Format: MM/DD/YYYY."

    endDate:
      widget: "text"
      label: "Date Range (End Date)"
      helpText: "If you want this entry to appear as a date range, use this field. Format: MM/DD/YYYY."

  heroes: ->
    heroQuote:
      widget: "textarea"
      label: "Hero Quote"
      className: "hero quote"

    heroQuoteSource:
      widget: "text"
      label: "Hero Quote Citation"
      className: "citation"

    villainQuote:
      widget: "textarea"
      label: "Villain Quote"
      className: "villain quote"

    villainQuoteSource:
      widget: "text"
      label: "Villain Quote Citation"
      className: "citation"

    ambiQuote:
      widget: "textarea"
      label: "Ambiguous Quote"
      className: "ambiquote quote"

    ambiQuoteSource:
      widget: "text"
      label: "Ambiguous Quote Source"
      className: "citation"


# A Form is a Collection of Fields. A Formset is a Collection of Forms. Each Form
# can have different 'modes', and modes define which fields are necessary. This way,
# we can dynamically add / remove modes, and the corresponding fields that they
# use.

class FieldModel extends Backbone.Model

	validateModel: (attrs = @toJson(), options) ->
		if attrs.required
			if not attrs.value? or attrs.value is ''
				@set 'error', 'This field is required'
				return true
			if @has 'error' then @unset 'error'

class FieldCollection extends Backbone.Collection

	model: FieldModel

	saveCollection: ->
		json = {}
		@each (model) ->
			val = model.get 'value'
			json[model.get 'name'] = model.get 'value' if val?
		@formModel.setAndSave json

	generateFieldModels: ->
    attr = @formModel.toJSON()
    @type = attr.type
    @prods = attr.prods
    fields = @determineRequiredFields type: attr.type, prods: attr.prods

    for key, field of fields
      field.name = key

      if key is 'prods'
        for prod, prodKey of field.fields[0]
          prod.value = 'checked' if _.contains attr.prods, prodKey
          prod.name = prodKey

      else if field.widget is 'fieldset'
        field.subfields = _.map field.fields, (subfield, key) ->
          subfield.name = key
          new FieldModel(subfield)

      else if not attr[key]?
        field.value = attr[key]

      @add(field)
    return this







